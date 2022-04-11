import { Card } from "./card";

export class DiscardPile {
  private readonly _cards: Card[] = [];

  get cards(): readonly Card[] {
    return this._cards;
  }

  discard(card: Card): void {
    this._cards.push(card);
  }
}