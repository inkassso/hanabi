import { Card, CardNumber, isColorful, SingleColor } from "./card";
import { DiscardPile } from "./discard-pile";
import { DrawDeck } from "./draw-deck";
import { DrawDeckDepletedError, StormTokensDepletedError } from "./error";
import { Player } from "./player";

type Table = {
  [color in SingleColor]: Card[]
};

export class GameBoard {

  private table: Table = {
    blue: [],
    green: [],
    red: [],
    white: [],
    yellow: []
  };

  private readonly initialStormTokens: number;

  constructor(
    public noteTokens: number,
    public stormTokens: number,
    private drawDeck: DrawDeck,
    private discardPile: DiscardPile
  ) {
    this.initialStormTokens = stormTokens;
  }

  giveHint(from: Player, to: Player, card: Card, hint: CardNumber | SingleColor): void {
    if (from === to) {
      throw new Error(`Player ${from.name} cannot give hints to himself`);
    }
    if (!to.hasCard(card)) {
      throw new Error(`Player ${to.name} does not have card ${card.toString()}`);
    }
    if (!card.hasColorOrNumber(hint)) {
      throw new Error(`Hint ${hint} does not describe card ${card.toString()}`);
    }
    console.log(`Player ${from.name} is giving ${to.name} a hint on card ${card.toString()}: ${hint}`);
    // TODO implement
  }

  discardCard(player: Player, card: Card): void {
    player.removeCard(card);
    this.discardPile.discard(card);
    this.drawCard(player);
  }

  playCard(player: Player, card: Card, applicableColor?: SingleColor): void {
    if (!player.hasCard(card)) {
      throw new Error(`Player ${player.name} does not have card ${card.toString()}`);
    }
    if (isColorful(card.color)) {
      if (!applicableColor) {
        throw new Error(`Player ${player.name} must choose the firework to apply the card to`);
      }
    }
    else if (applicableColor && applicableColor !== card.color) {
      throw new Error(`Player ${player.name} cannot play card ${card.toString()} with applicable color ${applicableColor}`);
    }
    else {
      applicableColor = card.color;
    }

    const firework = this.table[applicableColor];

    let incorrectPlayReason: string | undefined;
    if (firework.length === 0 && card.number !== 1) {
      incorrectPlayReason = `${applicableColor} firework is empty, number 1 expected, number ${card.number} played`;
    }
    else if (firework.length === 5) {
      incorrectPlayReason = `${applicableColor} firework is already fully assembled`;
    }
    else if (card.number !== firework[firework.length - 1].number + 1) {
      const currentNumber = firework[firework.length - 1].number;
      incorrectPlayReason = `${applicableColor} firework is on number ${currentNumber}, number ${currentNumber + 1} expected, number ${card.number} played`;
    }

    if (incorrectPlayReason) {
      console.log(`Card cannot be played:`, incorrectPlayReason);
      if (--this.stormTokens == 0) {
        throw new StormTokensDepletedError(`All ${this.initialStormTokens} storm tokens have been depleted`);
      }
    }

    player.removeCard(card);
    firework.push(card);

    this.drawCard(player);
  }

  private drawCard(player: Player): void {
    if (!this.drawDeck.hasCards()) {
      throw new DrawDeckDepletedError(`All cards have been used up, player ${player.name} is not getting a card anymore`);
    }
    const newCard = this.drawDeck.drawCard();
    player.addCard(newCard);
  }
}