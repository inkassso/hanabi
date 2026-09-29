import { Component, effect, inject, Injector, signal } from '@angular/core';
import { Card, GameLogic, GameOverError, isColorful, Player, singleColors } from '../types';
import { GameSetup } from '../types/setup';
import { ToastService } from '../toast-container/toast.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  standalone: false
})
export class GameComponent {

  readonly logic = signal<GameLogic | undefined>(undefined);
  readonly gameOverReason = signal<GameOverError | undefined>(undefined);
  private readonly injector = inject(Injector);
  private readonly notifications = effect(() => {
    const game = this.logic();
    if (!game) return;

    const error = game.error();
    if (error) {
      this.toastr.error(error.message);
      game.error.set(undefined);
    }

    const gameOver = game.gameOver();
    if (gameOver) {
      this.gameOverReason.set(gameOver);
      game.gameOver.set(undefined);
      this.end();
    }

    const depletedPlayer = game.drawDeckDepleted();
    if (depletedPlayer) {
      this.toastr.info(`Player ${depletedPlayer.name} depleted the draw deck.`, 'Last round');
      game.drawDeckDepleted.set(undefined);
    }

    const finishedPlayer = game.gameFinished();
    if (finishedPlayer) {
      this.toastr.success(`Congratulations! Player ${finishedPlayer.name} finished the last firework!`, 'You won!');
      game.gameFinished.set(undefined);
      this.end();
    }
  });

  constructor(private toastr: ToastService) { }

  getCardBackgroundClass(player: Player, card: Card): string {
    if (player === this.logic()?.activePlayer()) {
      return '';
    }
    return card.color;
  }

  getCardDescription(player: Player, card: Card): string {
    if (player === this.logic()?.activePlayer()) {
      return 'Card';
    }
    return `${card.color.replace(/^./, char => char.toUpperCase())} ${card.number}`;
  }

  readonly isColorful = isColorful;
  readonly allSingleColors = singleColors;

  start(setup: GameSetup): void {
    this.end();
    this.gameOverReason.set(undefined);
    this.logic.set(new GameLogic(setup, this.injector));
  }

  end(): void {
    this.logic()?.destroy();
    this.logic.set(undefined);
  }
}
