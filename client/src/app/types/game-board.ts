import { computed, signal, WritableSignal } from "@angular/core";
import { Card, CardNumber, cardNumbers, isColorful, SingleColor } from "./card";
import { DiscardPile } from "./discard-pile";
import { DrawDeck } from "./draw-deck";
import { StormTokensDepletedError } from "./errors";
import { Player } from "./player";

type WritableFireworks = {
  readonly [color in SingleColor]: Card[]
};
export type Fireworks = {
  [key in keyof WritableFireworks]: readonly Card[];
}


export class GameBoard {

  private readonly _fireworks = signal<WritableFireworks>({
    blue: [],
    green: [],
    red: [],
    white: [],
    yellow: []
  });
  readonly fireworks = computed(() => this._fireworks());

  private readonly initialNoteTokens: number;
  private readonly initialStormTokens: number;

  readonly drawDeckDepleted = signal<Player | undefined>(undefined);
  readonly fireworkCompletions = signal<readonly SingleColor[]>([]);
  readonly noteTokens: WritableSignal<number>;
  readonly stormTokens: WritableSignal<number>;

  constructor(
    noteTokens: number,
    stormTokens: number,
    private drawDeck: DrawDeck,
    private discardPile: DiscardPile
  ) {
    this.noteTokens = signal(noteTokens);
    this.stormTokens = signal(stormTokens);
    this.initialNoteTokens = noteTokens;
    this.initialStormTokens = stormTokens;
  }

  giveHint(from: Player, to: Player, card: Card, hint: SingleColor | CardNumber): void {
    if (this.noteTokens() <= 0) {
      throw new Error(`You're out of note tokens. Either discard a card to receive a note token, or play one.`);
    }
    if (from === to) {
      throw new Error(`Player ${from.name} cannot give hints to himself.`);
    }
    if (!to.hasCard(card)) {
      throw new Error(`Player ${to.name} does not have card ${card.toString()}.`);
    }
    if (!card.hasColorOrNumber(hint)) {
      throw new Error(`Hint ${hint} does not describe card ${card.toString()}.`);
    }
    console.log(`Player ${from.name} is giving ${to.name} a hint on card ${card.toString()}: ${hint}`);

    to.receiveHint(card, hint);

    this.noteTokens.update(tokens => tokens - 1);
  }

  discardCard(player: Player, card: Card): void {
    player.removeCard(card);
    this.discardPile.discard(card);
    this.drawCard(player);
    if (this.noteTokens() < this.initialNoteTokens) {
      this.noteTokens.update(tokens => tokens + 1);
    }
  }

  playCard(player: Player, card: Card, applicableColor?: SingleColor): void {
    if (!player.hasCard(card)) {
      throw new Error(`Player ${player.name} does not have card ${card.toString()}.`);
    }
    if (isColorful(card.color)) {
      if (!applicableColor) {
        throw new Error(`Player ${player.name} must choose the firework to apply the card to.`);
      }
    }
    else if (applicableColor && applicableColor !== card.color) {
      throw new Error(`Player ${player.name} cannot play card ${card.toString()} with applicable color ${applicableColor}.`);
    }
    else {
      applicableColor = card.color;
    }

    const fireworkColor = applicableColor;
    if (!fireworkColor) {
      throw new Error(`Player ${player.name} must choose the firework to apply the card to.`);
    }
    const firework = this._fireworks()[fireworkColor];

    let incorrectPlayReason: string | undefined;
    if (firework.length === 0) {
      if (card.number !== 1) {
        incorrectPlayReason = `${applicableColor} firework is empty, number 1 expected, number ${card.number} played.`;
      }
    }
    else if (firework.length === 5) {
      incorrectPlayReason = `${applicableColor} firework is already fully assembled.`;
    }
    else if (card.number !== firework[firework.length - 1].number + 1) {
      const currentNumber = firework[firework.length - 1].number;
      incorrectPlayReason = `${applicableColor} firework is on number ${currentNumber}, number ${currentNumber + 1} expected, number ${card.number} played.`;
    }

    // whatever happens, replace player's card
    player.removeCard(card);
    this.drawCard(player);

    if (incorrectPlayReason) {
      console.log(`Card cannot be played:`, incorrectPlayReason);
      const tokens = this.stormTokens() - 1;
      this.stormTokens.set(tokens);
      if (tokens === 0) {
        throw new StormTokensDepletedError(`All ${this.initialStormTokens} storm tokens have been depleted.`);
      }
    }
    else {
      const nextFirework = [...firework, card];
      this._fireworks.update(fireworks => ({
        ...fireworks,
        [fireworkColor]: nextFirework
      }));
      if (nextFirework.length === cardNumbers.length) {
        this.fireworkCompletions.update(colors => [...colors, fireworkColor]);
      }
    }
  }

  private drawCard(player: Player): void {
    if (!this.drawDeck.hasCards()) {
      return;
    }

    const newCard = this.drawDeck.drawCard();
    player.addCard(newCard);

    if (!this.drawDeck.hasCards()) {
      console.log(`All cards have been used up, player ${player.name} is not getting a card anymore.`);
      this.drawDeckDepleted.set(player);
    }
  }
}