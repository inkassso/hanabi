import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, effect, inject, Injector, signal, viewChild } from '@angular/core';
import { GameLogic, GameOverError } from '../types';
import { GameSetup } from '../types/setup';
import { ToastService } from '../toast-container/toast.service';
import { GameBoardComponent } from './game-board.component';
import { SetupComponent } from '../setup/setup.component';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  imports: [GameBoardComponent, SetupComponent, NgxBootstrapIconsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {

  readonly logic = signal<GameLogic | undefined>(undefined);
  readonly gameOverReason = signal<GameOverError | undefined>(undefined);
  readonly landingAnimationReady = signal(false);
  readonly landingTitleAnimationPlayed = signal(false);
  readonly returningToSetup = signal(false);
  private readonly pageTitle = viewChild<ElementRef<HTMLHeadingElement>>('pageTitle');
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

  constructor(private toastr: ToastService) {
    afterNextRender(() => {
      const title = this.pageTitle();
      if (!title) {
        return;
      }

      const bounds = title.nativeElement.getBoundingClientRect();
      title.nativeElement.style.setProperty(
        '--landing-title-center-offset',
        `${window.innerHeight / 2 - bounds.top - bounds.height / 2}px`
      );
      this.landingAnimationReady.set(true);
    });
  }

  start(setup: GameSetup): void {
    this.transitionTitle(() => {
      this.logic()?.destroy();
      this.landingTitleAnimationPlayed.set(true);
      this.returningToSetup.set(false);
      this.gameOverReason.set(undefined);
      this.logic.set(new GameLogic(setup, this.injector));
    });
  }

  end(): void {
    if (!this.logic()) {
      return;
    }
    this.transitionTitle(() => {
      this.logic()?.destroy();
      this.returningToSetup.set(true);
      this.logic.set(undefined);
    });
  }

  private transitionTitle(update: () => void): void {
    const title = this.pageTitle()?.nativeElement;
    const startTop = title?.getBoundingClientRect().top;
    update();

    if (!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    afterNextRender(() => {
      const currentTitle = this.pageTitle()?.nativeElement;
      if (currentTitle !== title || startTop === undefined) {
        return;
      }

      const offset = startTop - title.getBoundingClientRect().top;
      if (offset === 0) {
        return;
      }

      title.animate(
        [{ transform: `translateY(${offset}px)` }, { transform: 'translateY(0)' }],
        { duration: 550, easing: 'cubic-bezier(0.2, 0.75, 0.3, 1)' }
      );
    }, { injector: this.injector });
  }
}
