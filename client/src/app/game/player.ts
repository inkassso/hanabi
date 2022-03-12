import { Subject } from "rxjs";
import { DiscardCardAction, GiveHintAction, IAction, PlayCardAction } from "./actions";
import { Card, CardNumber, SingleColor } from "./card";

export class Player {

  action$ = new Subject<IAction>();

  constructor(
    public readonly name: string,
    public readonly cards: Card[]
  ) {
    console.debug(`Initialized player ${name} with cards:`, cards.map(card => card.toString()));
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }

  removeCard(card: Card): void {
    const cardIndex = this.cards.indexOf(card);
    if (cardIndex === -1) {
      throw new Error(`Player ${this.name} does not have card ${card.toString()}`);
    }
    this.cards.splice(cardIndex, 1);
  }

  hasCard(card: Card): boolean {
    return this.cards.includes(card);
  }

  giveHint(otherPlayer: Player, card: Card, hint: CardNumber | SingleColor): void {
    this.action$.next(new GiveHintAction(this, otherPlayer, card, hint));
  }

  discardCard(card: Card): void {
    this.action$.next(new DiscardCardAction(this, card));
  }

  playCard(card: Card, applicableColor?: SingleColor): void {
    this.action$.next(new PlayCardAction(this, card, applicableColor));
  }
}