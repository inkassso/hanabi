import { EffectRef, effect, Injector, signal, computed } from "@angular/core";
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

  readonly error = signal<Error | undefined>(undefined);
  readonly gameOver = signal<GameOverError | undefined>(undefined);
  readonly drawDeckDepleted = signal<Player | undefined>(undefined);
  readonly gameFinished = signal<Player | undefined>(undefined);

  readonly drawDeck = new DrawDeck();
  readonly discardPile = new DiscardPile();

  readonly gameBoard = new GameBoard(defaults.noteTokens, defaults.stormTokens, this.drawDeck, this.discardPile);

  readonly players: Player[];
  private readonly playerOnTurn = signal(0);
  private lastPlayerToPlay: Player | undefined;
  private lastRoundEnabled = false;

  private readonly finishedFireworks = signal<readonly SingleColor[]>([]);
  private readonly effects: EffectRef[] = [];

  readonly activePlayer = computed(() => this.players[this.playerOnTurn()]);

  readonly noteTokens = computed(() => this.gameBoard.noteTokens());

  readonly stormTokens = computed(() => this.gameBoard.stormTokens());

  constructor(setup: GameSetup, injector: Injector) {
    if (setup.playerNames.length < playerSettings.min) {
      throw new Error(`At least ${playerSettings.min} players must be playing, ${setup.playerNames.length} defined.`);
    }
    if (setup.playerNames.length > playerSettings.max) {
      throw new Error(`At most ${playerSettings.max} players can play, ${setup.playerNames.length} defined.`);
    }
    const cardsToDraw = setup.playerNames.length <= 3 ? 5 : 4;
    this.players = setup.playerNames.map(name => new Player(name, this.drawDeck.drawCards(cardsToDraw)));

    for (const player of this.players) {
      this.effects.push(effect(() => {
        if (player.pendingActions().length === 0) return;
        for (const action of player.takePendingActions()) {
          this.failSafe(() => this.executePlayerAction(action));
        }
      }, { injector }));
    }

  }

  destroy(): void {
    for (const gameEffect of this.effects) {
      gameEffect.destroy();
    }
  }

  private executePlayerAction(action: IAction): void {
    try {
      this.checkActivePlayer(action);
      try {
        action.perform(this.gameBoard);
      } finally {
        this.processBoardEvents();
      }
      this.nextPlayerTurn();
    } catch (e) {
      if (e instanceof GameOverError) {
        this.gameOver.set(e);
      }
      else throw e;
    }
  }

  private processBoardEvents(): void {
    const lastDrawingPlayer = this.gameBoard.drawDeckDepleted();
    if (lastDrawingPlayer) {
      this.lastPlayerToPlay = lastDrawingPlayer;
      this.lastRoundEnabled = false;
      this.drawDeckDepleted.set(lastDrawingPlayer);
      this.gameBoard.drawDeckDepleted.set(undefined);
    }

    const completions = this.gameBoard.fireworkCompletions();
    while (this.finishedFireworks().length < completions.length) {
      const color = completions[this.finishedFireworks().length];
      if (this.finishedFireworks().includes(color)) {
        throw new Error(`${color} firework was already finished.`);
      }
      this.finishedFireworks.update(colors => [...colors, color]);
      if (singleColors.every(fireworkColor => this.finishedFireworks().includes(fireworkColor))) {
        console.log('All fireworks have been assembled');
        this.gameFinished.set(this.activePlayer());
      }
    }
  }

  private checkActivePlayer(action: IAction): void {
    if (action.sourcePlayer !== this.activePlayer()) {
      throw new Error(`Player ${action.sourcePlayer.name} attempted to play while not his turn: ${action.toString()}`)
    }
  }

  private nextPlayerTurn(): void {
    if (this.activePlayer() === this.lastPlayerToPlay) {
      if (this.lastRoundEnabled) {
        throw new LastRoundPlayedError(`All cards have been used up and last round was played.`);
      }
      else {
        this.lastRoundEnabled = true;
      }
    }
    this.playerOnTurn.update(playerOnTurn => (playerOnTurn + 1) % this.players.length);
  }

  failSafe<T>(action: () => T): T | undefined {
    try {
      return action();
    } catch (e) {
      console.error(e);
      this.error.set(e instanceof Error ? e : new Error(String(e)));
    }
    return undefined;
  }
}