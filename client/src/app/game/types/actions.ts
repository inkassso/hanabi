import { Card, CardNumber, SingleColor } from "./card";
import { GameBoard } from "./game-board";
import { Player } from "./player";

export interface IAction {
  readonly sourcePlayer: Player;
  perform(board: GameBoard): void;
  toString(): string;
}

export class GiveHintAction implements IAction {
  constructor(
    readonly sourcePlayer: Player,
    readonly targetPlayer: Player,
    readonly card: Card,
    readonly hint: CardNumber | SingleColor
  ) { }

  perform(board: GameBoard): void {
    board.giveHint(this.sourcePlayer, this.targetPlayer, this.card, this.hint);
  }

  toString(): string {
    return `Player ${this.sourcePlayer} gives a hint to player ${this.targetPlayer.name}` +
      ` about card ${this.card.toString()} being ${this.hint}.`;
  }
}

export class DiscardCardAction implements IAction {
  constructor(
    readonly sourcePlayer: Player,
    readonly card: Card
  ) { }

  perform(board: GameBoard): void {
    board.discardCard(this.sourcePlayer, this.card);
  }

  toString(): string {
    return `Player ${this.sourcePlayer} discards card ${this.card.toString()}.`;
  }
}

export class PlayCardAction implements IAction {
  constructor(
    readonly sourcePlayer: Player,
    readonly card: Card,
    readonly applicableColor?: SingleColor
  ) { }

  perform(board: GameBoard): void {
    board.playCard(this.sourcePlayer, this.card, this.applicableColor);
  }

  toString(): string {
    return `Player ${this.sourcePlayer} plays card ${this.card.toString()}.`;
  }
}
