import { browser } from "$app/environment";
import db from "$lib/db";
import type { ILot } from "$lib/interfaces";
import RandomColor from "$lib/misc/RandomColor";
import { liveQuery } from "dexie";
import storable from "./LocalStore.svelte";

interface IAddedValueData {
	id: number;
	value: number;
}

class LotStore {
	private _lastId = 0;
	private _randomColor = new RandomColor();

	private _settings = storable({
		isTotalValueHidden: false,
	}, 'lotListSettings');

	private _items: ILot[] | undefined = $state();
	private _addedValue: { id: number, value: number } | null = $state(null);
	private _lastAddedLot: ILot | null = $state(null);
	private _addedValues: IAddedValueData[] = $state([]);
	private _newelyAddedLots: ILot[] = $state([]);
	readonly sortedItems = $derived(this._items?.toSorted((a, b) => b.value - a.value));
	readonly totalValue = $derived.by(this._getTotal.bind(this));
	readonly isEmpty = $derived(this._items?.length === 0);

	constructor() {
		if (browser) {
			liveQuery(async () => await db.lots.toArray())
				.subscribe((items) => {
					const oldLeader = this.sortedItems?.[0];

					this._items = items;

					if (oldLeader) {
						this._setNewLeader(oldLeader);
					}
				});

			db.lots.orderBy('id')
				.last()
				.then((item) => this._lastId = item?.id || 0);
		}
	}

	private _setNewLeader(oldLeader: ILot) {
		const newLeader = this.sortedItems?.[0];

		if (newLeader && newLeader.id !== oldLeader.id) {
			dispatchEvent(new CustomEvent('__newLeader', { detail: newLeader }));
		}
	}

	public getLotFromString(str: string) {
		const lotId = str.match(/\B(#[\d]+\b)/);
		const replacedLotId = lotId && Number(lotId[0].replace('#', ''));

		if (replacedLotId) return this.getById(replacedLotId);

		return this.getByTitle(str);
	}

	public getByTitle(title: string) {
		return this._items?.find((item) => item.title.toLowerCase() === title.toLowerCase());
	}

	public getById(id: number) {
		return this._items?.find((item) => item.id === id);
	}

	public searchItems(query: string) {
		if (!query || !this.sortedItems) return;
		return this.sortedItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
	}

	public async setValue(id: number, value: number) {
		db.lots.update(id, { value });
	}
	public async addValue(id: number, value: number, donator?: string) {
		const existingItem = this.getById(id);

		if (!existingItem) throw new Error(`Lot with ID ${id} not found`);

		const summedValue = existingItem.value + value;
		const isNewDonator = donator && !existingItem.donators.includes(donator);

		if (isNewDonator) {
			db.lots.update(id, {
				value: summedValue,
				donators: [...existingItem.donators, donator],
			});
		} else {
			db.lots.update(id, { value: summedValue });
		}

		this._addToAddedValuesArray({ ...existingItem, value });
	}
	public async setTitle(id: number, title: string) {
		db.lots.update(id, { title });
	}
	public async remove(id: number) {
		db.lots.delete(id);
	}
	public async clear() {
		this._lastId = 0;
		db.lots.clear();
	}
	public async add(title: string, value: number, donators: string[] = []) {
		const color = this._randomColor.get();
		const { r, g, b } = color.object();
		const item: ILot = {
			id: this._getNewId(),
			title,
			value,
			donators,
			color: { r, g, b },
			isDarkColor: color.isDark(),
		};

		db.lots.add(item);
		this._addToNewLotsArray(item);
		dispatchEvent(new CustomEvent('__newLot', { detail: item }));
	}

	public async randomizeColors() {
		if (!this._items) return;

		const update = this._items.map((item) => {
			const color = this._randomColor.get();
			const { r, g, b } = color.object();

			return {
				key: item.id,
				changes: {
					color: { r, g, b },
				}
			};
		});

		db.lots.bulkUpdate(update);
	}

	private _addToNewLotsArray(lot: ILot) {
		this._newelyAddedLots.push(lot);

		setTimeout(() => {
			const index = this._newelyAddedLots.findIndex((item) => item.id === lot.id);

			if (index > -1) {
				this._newelyAddedLots.splice(index, 1);
			}
		}, 5000);
	}

	private _addToAddedValuesArray(data: IAddedValueData) {
		const existingIndex = this._addedValues.findIndex((item) => item.id === data.id);

		if (existingIndex > -1) {
			this._addedValues[existingIndex].value += data.value;
		} else {
			this._addedValues.push(data);
			setTimeout(() => {
				const index = this._addedValues.findIndex((item) => item.id === data.id);

				if (index > -1) {
					this._addedValues.splice(index, 1);
				}
			}, 7000);
		}
	}

	private _getTotal() {
		return this._items?.map((item) => item.value)
			.reduce((sum, amount) => sum + amount, 0) ?? 0;
	}

	private _getNewId() {
		return ++this._lastId;
	}

	get items() { return this._items }
	get addedValue() { return this._addedValue }
	get lastAddedLot() { return this._lastAddedLot }
	get settings() { return this._settings.value; }
	get addedValues() { return this._addedValues }
	get newelyAddedLots() { return this._newelyAddedLots }
}

export default LotStore;
