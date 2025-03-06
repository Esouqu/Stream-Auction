import type { IDonationSocket, IDonationSocketData, ILot } from "$lib/interfaces";
import { untrack } from "svelte";
import DonationStore, { type IDonation } from "./DonationStore.svelte";
import LotStore from "./LotStore.svelte";
import RulePresetsStore from "./RulePresetsStore.svelte";
import TimerStore from "./TimerStore.svelte";
import WheelStore, { WHEEL_STATE } from "./WheelStore.svelte";
import storable from "./LocalStore.svelte";
import BackgroundStore from "./BackgroundStore.svelte";
import { browser } from "$app/environment";
import confetti from "canvas-confetti";
import { colors } from "$lib/constants";
import { SvelteMap } from "svelte/reactivity";

const sounds = [
	'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/sounds/anime-wow-sound-effect-u7tZ2gnHM8AdJGrbu2Z2TEDWc1zYLy.mp3',
	'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/sounds/metalgearsolid_SdQSBxQ-yuv4aChhxV1ljMdDnXb4KdylH4bs6s.mp3',
	'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/sounds/rizz-sound-effect-3oQk3xQBHBXo4AnsodkHXhjBvr4uN3.mp3',
	'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/sounds/vine-boom-pAit6s5cNmBFs7wFiuPxInTGGCvpx4.mp3',
];

export class AppManager {
	readonly lots = new LotStore();
	readonly donations = new DonationStore();
	readonly timer = new TimerStore();
	readonly rulePresets = new RulePresetsStore();
	readonly wheel = new WheelStore();
	readonly background = new BackgroundStore();

	private _settings = storable({
		// donation
		isSpinExtendEnabled: false,
		spinStopPrice: 9999,
		spinStopDelaySec: 30,
		spinExtendBasePrice: 50,
		spinExtendPriceGain: 50,
		spinExtendSec: 30,
		// timer
		isAutoAddTimeEnabled: false,
		newLeaderBonusSec: 60,
		newLotBonusSec: 30,
		newDonationBonusSec: 60,
		// interface
		theme: 'theme-white',
	}, 'appSettings');
	private _previousSpinExtendPrice = $state(this.settings.spinExtendBasePrice);
	private _spinExtendPrice = $state(this.settings.spinExtendBasePrice);
	private _spinExtends = $state(0);
	private _donationSockets = new SvelteMap<string, IDonationSocket>();

	private _timeoutId: NodeJS.Timeout | undefined;
	private _extendMultiplierWindowMs = 7000;

	private _celebrationAudios: HTMLAudioElement[] = [];
	private _dingAudio: HTMLAudioElement | undefined;

	constructor() {
		if (browser) {
			window.addEventListener('__newLeader', this._onLeaderChanged.bind(this));
			window.addEventListener('__newLot', this._onNewLotAdded.bind(this));
			window.addEventListener('__newDonation', this._onNewDonationAdded.bind(this));

			this._loadAudio();
		}

		$effect.root(() => {
			$effect(() => {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				this.wheel.state;

				untrack(() => this.onWheelStateChange(this.wheel.state))
			});

			$effect(() => {
				if (this.wheel.isDelayed && this.timer.isFinished) {
					untrack(() => this.wheel.stop())
				}
			});
		});
	}

	public removeSocket(socketId: string) {
		this._donationSockets.delete(socketId);
	}

	public addSocket(socket: IDonationSocket) {
		socket.onDonation = this.onDonation.bind(this);
		this._donationSockets.set(socket.id, socket);
	}

	private _playAudio(index?: number) {
		const idx = index || Math.floor(Math.random() * this._celebrationAudios.length);
		this._celebrationAudios[idx].load();
		this._celebrationAudios[idx].play();
	}

	private _loadAudio() {
		this._dingAudio = new Audio('https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/sounds/ding-7jemxPSHTFunK7cggRmYI5ikvecUaf.mp3');
		this._dingAudio.volume = 0.05;

		for (const sound of sounds) {
			const audio = new Audio(sound);
			audio.volume = 0.05;

			this._celebrationAudios.push(audio);
		}
	}

	private _onNewDonationAdded() {
		if (this.timer.isActive && !this.wheel.isActive && this.settings.isAutoAddTimeEnabled) {
			this.timer.add(this.settings.newDonationBonusSec * 1000);
		}
	}

	private _onLeaderChanged() {
		if (this.timer.isActive && !this.wheel.isActive && this.settings.isAutoAddTimeEnabled) {
			this.timer.add(this.settings.newLeaderBonusSec * 1000);
		}
	}

	private _onNewLotAdded() {
		if (this.timer.isActive && !this.wheel.isActive && this.settings.isAutoAddTimeEnabled) {
			this.timer.add(this.settings.newLotBonusSec * 1000);
		}
	}

	public setTheme(theme: string) {
		document.body.classList.forEach((cls) => {
			if (cls.startsWith('theme-')) document.body.classList.remove(cls);
		});

		this.settings.theme = theme;
		document.body.classList.add(theme);
	}

	public splitDonationAndAddLots(id: string, donations: Omit<IDonation, 'id' | 'isInstant'>[]) {
		for (const { message, amount, username } of donations) {
			appManager.lots.add(message, amount, [username]);
		}

		appManager.donations.remove(id);
	}

	public splitDonation(id: string, donations: Omit<IDonation, 'id' | 'isInstant'>[]) {
		for (const { message, amount, username, currency, source } of donations) {
			appManager.donations.add({
				id: crypto.randomUUID(),
				message,
				amount,
				username,
				currency,
				source,
				isInstant: false
			});
		}

		appManager.donations.remove(id);
	}

	public transferDonation(donation: IDonation, lotId: number) {
		this.lots.addValue(lotId, donation.amount, donation.username);
		this.donations.remove(donation.id);
	}

	private _addSpinMultiplier() {
		this._spinExtends = 1;

		if (this._timeoutId) clearTimeout(this._timeoutId);

		this._timeoutId = setTimeout(() => {
			this._spinExtends = 0;
		}, this._extendMultiplierWindowMs);
	}

	public stopSpinManually() {
		this.wheel.stop(true);
		this.timer.stop();
		this._spinExtendPrice = this.settings.spinExtendBasePrice;
	}

	public extendSpin() {
		const baseExtensionMs = this.settings.spinExtendSec * 1000;
		const timerTweenMs = 500;

		this.timer.add(baseExtensionMs - timerTweenMs);
		this.wheel.extendSpin(this.settings.spinExtendSec);
	}

	public onWheelStateChange(state: WHEEL_STATE) {
		const spinDurationMs = this.wheel.spinDuration * 1000;

		switch (state) {
			case WHEEL_STATE.PREPARING:
				this.timer.stop();
				this.timer.start(spinDurationMs);
				break;
			case WHEEL_STATE.DELAYED:
				if (this.settings.isSpinExtendEnabled) {
					this.timer.stop();
					this.timer.start(this.settings.spinStopDelaySec * 1000);
				}
				break;
			case WHEEL_STATE.FINISHED:
				this.timer.stop();
				this._spinExtendPrice = this.settings.spinExtendBasePrice;
				this._fireConfetti();

				setTimeout(() => {
					this._playAudio();
				}, 50)
				break;
		}
	}

	private _fireConfetti() {
		const defaults = {
			origin: {
				x: 0.51,
				y: 0.44
			},
			spread: 360,
			ticks: 100,
			gravity: 0,
			decay: 0.94,
			startVelocity: 30,
			colors: colors.map((c) => c.hex())
		};

		function shoot() {
			confetti({
				...defaults,
				particleCount: 40,
				scalar: 1.2,
				shapes: ['star'],
			});

			confetti({
				...defaults,
				particleCount: 30,
				scalar: 0.75,
				shapes: ['circle']
			});

			confetti({
				...defaults,
				particleCount: 30,
				scalar: 0.75,
				shapes: ['square']
			});
		}

		shoot();
		shoot();
		shoot();
	}

	private _getFlameSizeIncreaseAmount(donationAmount: number) {
		if (donationAmount >= this.background.settings.flameSize4Price) return 4;
		if (donationAmount >= this.background.settings.flameSize3Price) return 3;
		if (donationAmount >= this.background.settings.flameSize2Price) return 2;
		if (donationAmount >= this.background.settings.flameSize1Price) return 1;
		return 0;
	}

	private _activateEvent(donation: IDonationSocketData, lot?: ILot) {
		// Spin Stop Event
		if (donation.amount === this.settings.spinStopPrice) {
			this.wheel.stop();
			this._addDonation(donation);
			return;
		}

		// Spin Extend Event
		if (donation.amount >= this._spinExtendPrice) {
			if (this.wheel.isSpinning) {
				this.extendSpin();
			} else {
				this.wheel.spinDuration = this.settings.spinExtendSec;
				this.wheel.spin();
			}

			if (lot) {
				this._addDonationToLot(donation, lot);
			} else {
				this._addDonation(donation);
			}

			this._previousSpinExtendPrice = this._spinExtendPrice;
			this._spinExtendPrice += this.settings.spinExtendPriceGain;
			this._addSpinMultiplier();
			this._dingAudio?.load();
			this._dingAudio?.play();
			return;
		}

		if (lot && this.wheel.isSpinning) {
			this._addDonationToLot(donation, lot);
		} else {
			this._addDonation(donation);
		}
	}

	private _addDonationToLot(donation: IDonationSocketData, lot: ILot) {
		this.lots.addValue(lot.id, donation.amount, donation.username);
		this._addDonation({ ...donation, message: lot.title }, true);
	}

	private _addDonation(donation: IDonationSocketData, isInstant = false) {
		this.donations.add({
			id: crypto.randomUUID(),
			username: donation.username,
			amount: donation.amount,
			currency: donation.currency,
			message: donation.message,
			source: donation.source,
			isInstant
		});
	}

	public onDonation(donation: IDonationSocketData) {
		const lot = this.lots.getLotFromString(donation.message);

		if (this.settings.isSpinExtendEnabled && this.wheel.isActive) {
			this._activateEvent(donation, lot);
		} else if (lot) {
			this._addDonationToLot(donation, lot);
		} else {
			this._addDonation(donation);
		}

		if (this.background.settings.isFlameEnabled) {
			const triggerAmount = this._getFlameSizeIncreaseAmount(donation.amount);

			if (triggerAmount > 0 && this.background.currentFlameSize <= triggerAmount) {
				this.background.increaseFlameSize(triggerAmount);
			}
		}
	}

	get settings() { return this._settings.value; }
	get spinExtends() { return this._spinExtends; }
	get spinExtendPrice() { return this._spinExtendPrice; }
	get previousSpinExtendPrice() { return this._previousSpinExtendPrice; }
	get donatePaySocket() { return this._donationSockets.get('DonatePay'); }
	get donationAlertsSocket() { return this._donationSockets.get('DonationAlerts'); }
	get donationSockets() { return Array.from(this._donationSockets.values()); }
}

const appManager = new AppManager();

export default appManager;
