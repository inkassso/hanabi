import { Card } from "./card";

export class DiscardPile {
  readonly cards: Card[] = [];

  discard(card: Card): void {
    this.cards.push(card);
  }
}