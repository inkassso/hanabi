import { BehaviorSubject } from "rxjs";
import { IAction } from "./actions";
import { DiscardPile } from "./discard-pile";
import { DrawDeck } from "./draw-deck";
import { GameOverError } from "./error";
import { GameBoard } from "./game-board";
import { Player } from "./player";

const defaults = {
  noteTokens: 8,
  stormTokens: 3
};

const playerSettings = {
  min: 2,
  max: 5
};

export class GameLogic {

  error$ = new BehaviorSubject<Error | undefined>(undefined);
  gameOver$ = new BehaviorSubject<Error | undefined>(undefined);

  private drawDeck = new DrawDeck();
  private discardPile = new DiscardPile();

  private gameBoard = new GameBoard(defaults.noteTokens, defaults.stormTokens, this.drawDeck, this.discardPile);

  readonly players: Player[];
  private playerOnTurn = 0;

  get activePlayer(): Player {
    return this.players[this.playerOnTurn];
  }

  get noteTokens(): number {
    return this.gameBoard.noteTokens;
  }

  get stormTokens(): number {
    return this.gameBoard.stormTokens;
  }

  constructor(playerNames: string[]) {
    if (playerNames.length < playerSettings.min) {
      throw new Error(`At least ${playerSettings.min} players must be playing, ${playerNames.length} defined`);
    }
    if (playerNames.length > playerSettings.max) {
      throw new Error(`At most ${playerSettings.max} players can play, ${playerNames.length} defined`);
    }
    const cardsToDraw = playerNames.length <= 3 ? 5 : 4;
    this.players = playerNames.map(name => new Player(name, this.drawDeck.drawCards(cardsToDraw)));

    for (const player of this.players) {
      player.action$.subscribe(action => this.failSafe(() => this.executePlayerAction(action)));
    }
  }

  private executePlayerAction(action: IAction): void {
    try {
      this.checkActivePlayer(action);
      action.perform(this.gameBoard);
      this.nextPlayerTurn();
    } catch (e) {
      if (e instanceof GameOverError) {
        this.gameOver$.next(e);
      }
      else throw e;
    }
  }

  private checkActivePlayer(action: IAction): void {
    if (action.sourcePlayer !== this.activePlayer) {
      throw new Error(`Player ${action.sourcePlayer.name} attempted to play while not his turn: ${action.toString()}`)
    }
  }

  private nextPlayerTurn(): void {
    this.playerOnTurn = (this.playerOnTurn + 1) % this.players.length;
  }

  failSafe<T>(action: () => T): T | undefined {
    try {
      return action();
    } catch (e) {
      this.error$.next(e as Error); // TODO configure eslint
    }
    return undefined;
  }
}