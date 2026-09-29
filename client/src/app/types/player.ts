import { computed, signal } from "@angular/core";
import { DiscardCardAction, GiveHintAction, IAction, PlayCardAction } from "./actions";
import { Card, CardNumber, isCardNumber, isColorful, isSingleColor, SingleColor } from "./card";

export interface CardHints {
  color?: boolean;
  number?: boolean;
}

export class HeldCard {
  private readonly hints = signal({
    color: undefined as SingleColor | undefined,
    number: false
  });

  constructor(public readonly card: Card) { }

  enableNumberHint(): void {
    this.hints.update(hints => ({ ...hints, number: true }));
  }

  enableColorHint(color: SingleColor): void {
    if (color !== this.card.color && !isColorful(this.card.color)) {
      throw new Error(`Invalid hint, card ${this.card.toString()} is neither of color "${color}" nor colorful.`);
    }
    this.hints.update(hints => ({ ...hints, color }));
  }

  readonly hasHints = computed(() => !!this.hints().color || this.hints().number);

  readonly numberHinted = computed(() => this.hints().number ? this.card.number : undefined);

  readonly colorHinted = computed(() => this.hints().color);
}

export class Player {

  private readonly heldCards;
  readonly cards;
  readonly pendingActions = signal<readonly IAction[]>([]);

  constructor(
    public readonly name: string,
    cards: Card[]
  ) {
    this.heldCards = signal<readonly HeldCard[]>(cards.map(card => new HeldCard(card)));
    this.cards = this.heldCards.asReadonly();
    console.debug(`Initialized player ${name} with cards:`, cards.map(card => card.toString()));
  }

  addCard(card: Card): void {
    this.heldCards.update(cards => [...cards, new HeldCard(card)]);
  }

  removeCard(card: Card): void {
    const heldCards = this.heldCards();
    const cardIndex = heldCards.reduce<number | undefined>((found, hc, i) => found ?? (hc.card === card ? i : undefined), undefined);
    if (cardIndex === undefined) {
      throw new Error(`Player ${this.name} does not have card ${card.toString()}.`);
    }
    this.heldCards.set(heldCards.filter((_, index) => index !== cardIndex));
  }

  hasCard(card: Card): boolean {
    return !!this.heldCards().find(hc => hc.card === card);
  }

  receiveHint(card: Card, hint: SingleColor | CardNumber): void {
    const hc = this.heldCards().find(hc => hc.card === card);
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
    this.enqueueAction(new GiveHintAction(this, otherPlayer, card, hint));
  }

  discardCard(hc: HeldCard): void {
    this.enqueueAction(new DiscardCardAction(this, hc.card));
  }

  playCard(hc: HeldCard, applicableColor?: SingleColor): void {
    this.enqueueAction(new PlayCardAction(this, hc.card, applicableColor));
  }

  takePendingActions(): readonly IAction[] {
    const actions = this.pendingActions();
    this.pendingActions.set([]);
    return actions;
  }

  private enqueueAction(action: IAction): void {
    this.pendingActions.update(actions => [...actions, action]);
  }
}