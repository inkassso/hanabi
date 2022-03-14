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
  readonly cards: Card[];

  constructor() {
    const cards = createCards();
    this.cards = shuffle(cards);
    console.debug(`Draw deck initialized with ${this.cards.length} cards and shuffled`);
  }

  hasCards(): boolean {
    return this.cards.length !== 0;
  }

  drawCard(): Card {
    const card = this.cards.pop();
    if (!card) {
      throw new Error('No more cards to draw, game over');
    }
    return card;
  }

  drawCards(amount: number): Card[] {
    if (this.cards.length < amount) {
      throw new Error(`Not enough cards in deck to draw, currently having ${this.cards.length}, drawing ${amount}`);
    }
    return this.cards.splice(-amount);
  }
}
