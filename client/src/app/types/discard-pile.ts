import { Card } from "./card";

export class DiscardPile {
  private readonly cards: Card[] = [];

  discard(card: Card): void {
    this.cards.push(card);
  }
}