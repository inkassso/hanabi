import { BehaviorSubject } from "rxjs";
import { IAction } from "./actions";
import { SingleColor, singleColors } from "./card";
import { DiscardPile } from "./discard-pile";
import { DrawDeck } from "./draw-deck";
import { GameOverError, LastRoundPlayedError } from "./errors";
import { GameBoard } from "./game-board";
import { Player } from "./player";
import { GameSetup } from "./setup";

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
  gameOver$ = new BehaviorSubject<GameOverError | undefined>(undefined);
  drawDeckDepleted$ = new BehaviorSubject<Player | undefined>(undefined);
  gameFinished$ = new BehaviorSubject<Player | undefined>(undefined);

  readonly drawDeck = new DrawDeck();
  readonly discardPile = new DiscardPile();

  readonly gameBoard = new GameBoard(defaults.noteTokens, defaults.stormTokens, this.drawDeck, this.discardPile);

  readonly players: Player[];
  private playerOnTurn = 0;
  private lastPlayerToPlay: Player | undefined;
  private lastRoundEnabled = false;

  private finishedFireworks: SingleColor[] = [];

  get activePlayer(): Player {
    return this.players[this.playerOnTurn];
  }

  get noteTokens(): number {
    return this.gameBoard.noteTokens;
  }

  get stormTokens(): number {
    return this.gameBoard.stormTokens;
  }

  constructor(setup: GameSetup) {
    if (setup.playerNames.length < playerSettings.min) {
      throw new Error(`At least ${playerSettings.min} players must be playing, ${setup.playerNames.length} defined.`);
    }
    if (setup.playerNames.length > playerSettings.max) {
      throw new Error(`At most ${playerSettings.max} players can play, ${setup.playerNames.length} defined.`);
    }
    const cardsToDraw = setup.playerNames.length <= 3 ? 5 : 4;
    this.players = setup.playerNames.map(name => new Player(name, this.drawDeck.drawCards(cardsToDraw)));

    for (const player of this.players) {
      player.action$.subscribe(action => this.failSafe(() => this.executePlayerAction(action)));
    }

    this.gameBoard.drawDeckDepleted$.subscribe(playerLastDrawing => {
      this.lastPlayerToPlay = playerLastDrawing;
      this.lastRoundEnabled = false;
      this.drawDeckDepleted$.next(playerLastDrawing);
    });
    this.gameBoard.fireworkCompleted$.subscribe(color => {
      if (!color) return;
      if (this.finishedFireworks.includes(color)) {
        throw new Error(`${color} firework was already finished.`);
      }
      this.finishedFireworks.push(color);
      if (singleColors.every(color => this.finishedFireworks.includes(color))) {
        console.log('All fireworks have been assembled');
        this.gameFinished$.next(this.activePlayer);
      }
    })
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
    if (this.activePlayer === this.lastPlayerToPlay) {
      if (this.lastRoundEnabled) {
        throw new LastRoundPlayedError(`All cards have been used up and last round was played.`);
      }
      else {
        this.lastRoundEnabled = true;
      }
    }
    this.playerOnTurn = (this.playerOnTurn + 1) % this.players.length;
  }

  failSafe<T>(action: () => T): T | undefined {
    try {
      return action();
    } catch (e) {
      console.error(e);
      this.error$.next(e as Error); // TODO configure eslint
    }
    return undefined;
  }
}