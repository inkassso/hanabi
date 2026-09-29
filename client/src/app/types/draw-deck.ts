import { signal } from "@angular/core";
import { Card, CardColor } from "./card";
import { shuffle } from "./utils";

function createCardsOfColor(color: CardColor): Card[] {
  return [
    new Card(color, 1), new Card(color, 1), new Card(color, 1),
    new Card(color, 2), new Card(color, 2),
    new Card(color, 3), new Card(color, 3),
    new Card(color, 4), new Card(color, 4),
    new Card(color, 5),
  ]
}

function createCards(): Card[] {
  return [
    ...createCardsOfColor('green'),
    ...createCardsOfColor('blue'),
    ...createCardsOfColor('red'),
    ...createCardsOfColor('white'),
    ...createCardsOfColor('yellow'),
    ...createCardsOfColor('colorful')
  ];
}

export class DrawDeck {
  private readonly _cards = signal<readonly Card[]>([]);

  get cards(): readonly Card[] {
    return this._cards();
  }

  constructor() {
    const cards = createCards();
    this._cards.set(shuffle(cards));
    console.debug(`Draw deck initialized with ${this._cards().length} cards and shuffled`);
  }

  hasCards(): boolean {
    return this._cards().length !== 0;
  }

  drawCard(): Card {
    const cards = this._cards();
    const card = cards[cards.length - 1];
    if (!card) {
      throw new Error('No more cards to draw, game over');
    }
    this._cards.set(cards.slice(0, -1));
    return card;
  }

  drawCards(amount: number): Card[] {
    const cards = this._cards();
    if (cards.length < amount) {
      throw new Error(`Not enough cards in deck to draw, currently having ${cards.length}, drawing ${amount}`);
    }
    this._cards.set(cards.slice(0, -amount));
    return cards.slice(-amount);
  }
}
