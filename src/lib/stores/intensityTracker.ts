import { writable } from "svelte/store";

function createIntensityTracker() {
  const currentLevel = writable(0);
  const maxLevel = 4;
  const levelDecreaseTime = 15 * 1000;

  let intensityLevelDecreaseId: NodeJS.Timeout;
  let _currentLevel: number;

  currentLevel.subscribe((store) => _currentLevel = store);

  function increaseLevel(amount: number) {
    currentLevel.update((level) => {
      const summedLevels = level + amount;

      if (summedLevels > maxLevel) return maxLevel;

      return summedLevels;
    });

    decreaseWithInterval();
  }

  function decreaseLevel(amount = 1) {
    currentLevel.update((level) => {
      if (level < 1) return level;

      return level - amount > 0 ? level - amount : 0;
    });
  }

  function decreaseWithInterval() {
    clearInterval(intensityLevelDecreaseId);

    intensityLevelDecreaseId = setInterval(() => {
      if (_currentLevel < 1) clearInterval(intensityLevelDecreaseId);

      intensityTracker.decreaseLevel();
    }, levelDecreaseTime);
  }


  return {
    currentLevel,
    increaseLevel,
    decreaseLevel,
  }
}

const intensityTracker = createIntensityTracker();

export default intensityTracker;