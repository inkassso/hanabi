export const cardLow = 1;
const cardHighExclusive = 6;
export const cardHigh = cardHighExclusive - 1;

export const cardNumbers = Array.from(Array(cardHighExclusive).keys()).slice(1);

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

/**
 * Possible numbers of firework cards
 */
export type CardNumber = Range<typeof cardLow, typeof cardHighExclusive>;
export function isCardNumber(val: any): val is CardNumber {
  return cardNumbers.includes(val);
}

export const cardColors = ['red', 'green', 'blue', 'white', 'yellow'] as const;
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

/**
 * Mapping of card colors to Bootstrap classes
 */
export const colorToBootstrap: { [name in CardColor]: string } = {
  blue: 'primary',
  green: 'success',
  red: 'danger',
  white: 'light',
  yellow: 'warning',
  colorful: 'colorful'
}
