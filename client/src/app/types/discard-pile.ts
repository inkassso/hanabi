import { signal } from "@angular/core";
import { Card } from "./card";

export class DiscardPile {
  readonly cards = signal<readonly Card[]>([]);

  discard(card: Card): void {
    this.cards.update(cards => [...cards, card]);
  }
}