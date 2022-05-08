import { Subject } from "rxjs";
import { DiscardCardAction, GiveHintAction, IAction, PlayCardAction } from "./actions";
import { Card, CardNumber, SingleColor } from "./card";

export class HeldCard {
  public hints = {
    color: false,
    number: false
  };

  constructor(public readonly card: Card) { }
}

export class Player {

  private heldCards: HeldCard[];

  get cards(): readonly HeldCard[] {
    return this.heldCards;
  }

  action$ = new Subject<IAction>();

  constructor(
    public readonly name: string,
    cards: Card[]
  ) {
    this.heldCards = cards.map(card => new HeldCard(card));
    console.debug(`Initialized player ${name} with cards:`, cards.map(card => card.toString()));
  }

  addCard(card: Card): void {
    this.heldCards.push(new HeldCard(card));
  }

  removeCard(card: Card): void {
    const cardIndex = this.heldCards.reduce<number | undefined>((found, hc, i) => found ?? hc.card === card ? i : undefined, undefined);
    if (cardIndex === undefined) {
      throw new Error(`Player ${this.name} does not have card ${card.toString()}`);
    }
    this.heldCards.splice(cardIndex, 1);
  }

  hasCard(card: Card): boolean {
    return !!this.heldCards.find(hc => hc.card === card);
  }

  giveHint(otherPlayer: Player, card: Card, hint: CardNumber | SingleColor): void {
    this.action$.next(new GiveHintAction(this, otherPlayer, card, hint));
  }

  discardCard(hc: HeldCard): void {
    this.action$.next(new DiscardCardAction(this, hc.card));
  }

  playCard(hc: HeldCard, applicableColor?: SingleColor): void {
    this.action$.next(new PlayCardAction(this, hc.card, applicableColor));
  }
}