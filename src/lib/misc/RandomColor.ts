import Color from "color";
import { colors } from "../constants";

class RandomColor {
  private _current: Color[] = [];
  private _last: Color | undefined;
  private _currentIndex = 0;

  public get(): Color {
    // If we've reached the end of the current array, shuffle it and start again
    if (this._currentIndex === this._current.length) {
      this._next();
    }

    // Get the color at the current index and increment the index
    // The modulo ensures that we wrap around to the start of the array when we reach the end
    return this._current[this._currentIndex++ % this._current.length];
  }

  private _next() {
    const shuffledColors = [...colors];

    this._last = this._current[this._current.length - 1];

    do {
      for (let i = shuffledColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
      }
    } while (
      shuffledColors.length > 1 &&
      shuffledColors[0].hex() === this._last?.hex()
    )

    this._current = shuffledColors;
  }
}

export default RandomColor;
