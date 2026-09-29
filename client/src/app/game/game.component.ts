import { ChangeDetectionStrategy, Component, effect, inject, Injector, signal } from '@angular/core';
import { GameLogic, GameOverError } from '../types';
import { GameSetup } from '../types/setup';
import { ToastService } from '../toast-container/toast.service';
import { GameBoardComponent } from './game-board.component';
import { SetupComponent } from '../setup/setup.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  imports: [GameBoardComponent, SetupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
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
