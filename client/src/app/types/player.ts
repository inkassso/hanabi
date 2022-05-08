import { Subject } from "rxjs";
import { DiscardCardAction, GiveHintAction, IAction, PlayCardAction } from "./actions";
import { Card, CardNumber, isCardNumber, isColorful, isSingleColor, SingleColor } from "./card";

export interface CardHints {
  color?: boolean;
  number?: boolean;
}

export class HeldCard {
  private hints = {
    color: undefined as SingleColor | undefined,
    number: false
  };

  constructor(public readonly card: Card) { }

  enableNumberHint(): void {
    this.hints.number = true;
  }

  enableColorHint(color: SingleColor): void {
    if (color !== this.card.color && !isColorful(this.card.color)) {
      throw new Error(`Invalid hint, card ${this.card.toString()} is neither of color "${color}" nor colorful.`);
    }
    this.hints.color = color;
  }

  get hasHints(): boolean {
    return !!this.hints.color || this.hints.number;
  }

  get numberHinted(): CardNumber | undefined {
    return this.hints.number ? this.card.number : undefined;
  }

  get colorHinted(): SingleColor | undefined {
    return this.hints.color;
  }
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
    const cardIndex = this.heldCards.reduce<number | undefined>((found, hc, i) => found ?? (hc.card === card ? i : undefined), undefined);
    if (cardIndex === undefined) {
      throw new Error(`Player ${this.name} does not have card ${card.toString()}.`);
    }
    this.heldCards.splice(cardIndex, 1);
  }

  hasCard(card: Card): boolean {
    return !!this.heldCards.find(hc => hc.card === card);
  }

  receiveHint(card: Card, hint: SingleColor | CardNumber): void {
    const hc = this.heldCards.find(hc => hc.card === card);
    if (!hc) {
      throw new Error(`Player ${this.name} cannot receive hint as he does not have card ${card.toString()}.`);
    }
    if (isSingleColor(hint)) {
      hc.enableColorHint(hint);
    }
    else if (isCardNumber(hint)) {
      if (hint !== card.number) {
        throw new Error(`Invalid hint, card ${card.toString()} does not have number "${hint}".`);
      }
      hc.enableNumberHint();
    }
    else {
      throw new Error(`Unknown hint: ${hint}`);
    }
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