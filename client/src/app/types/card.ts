export const cardNumbers = [1, 2, 3, 4, 5] as const;
/**
 * Possible numbers of firework cards
 */
export type CardNumber = typeof cardNumbers[number];
export function isCardNumber(val: any): val is CardNumber {
  return cardNumbers.includes(val);
}

export const cardColors = ['red', 'yellow', 'green', 'blue', 'white'] as const;
/**
 * Possible distinct colors of firework cards
 */
export type SingleColor = typeof cardColors[number];
export function isSingleColor(val: any): val is SingleColor {
  return cardColors.includes(val);
}

const colorful = 'colorful';
/**
 * Colorful firework card "color"
 */
export type Colorful = typeof colorful;
export function isColorful(val: any): val is Colorful {
  return val === colorful;
}

/**
 * All possible types of card colorization, including single colors and colorful
 */
export type CardColor = SingleColor | Colorful;
export function isCardColor(val: any): val is CardColor {
  return isSingleColor(val) || isColorful(val);
}

/**
 * Model for a playing firework card
 */
export class Card {
  constructor(
    public readonly color: CardColor,
    public readonly number: CardNumber
  ) { }

  /**
   * Check if this card has the specified color
   * @param color distinct color to check
   * @returns true if the card is of the specified color or if it's colorful
   */
  hasColor(color: SingleColor): boolean {
    return this.color === color || this.color === 'colorful';
  }

  /**
   * Check if this card has the specified number
   * @param number number to check
   * @returns true if the card has the specified number
   */
  hasNumber(number: CardNumber): boolean {
    return this.number === number;
  }

  hasColorOrNumber(property: SingleColor | CardNumber): boolean {
    return (isSingleColor(property) && this.hasColor(property)) ||
      (isCardNumber(property) && this.hasNumber(property));
  }

  toString(): string {
    return `[${this.color} ${this.number}]`;
  }
}