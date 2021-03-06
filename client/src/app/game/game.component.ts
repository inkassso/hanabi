import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Card, GameLogic, GameOverError, isColorful, Player, singleColors } from '../types';
import { GameSetup } from '../types/setup';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent {

  logic?: GameLogic;

  constructor(private toastr: ToastrService) { }

  getCardBackgroundClass(player: Player, card: Card): string {
    if (player === this.logic?.activePlayer) {
      return '';
    }
    return card.color;
  }

  getCardDescription(player: Player, card: Card): string {
    if (player === this.logic?.activePlayer) {
      return 'Card';
    }
    return `${card.color.replace(/^./, char => char.toUpperCase())} ${card.number}`;
  }

  readonly isColorful = isColorful;
  readonly allSingleColors = singleColors;

  private subscriptions: Subscription[] = [];
  gameOverReason: GameOverError | undefined;

  start(setup: GameSetup): void {
    this.logic = new GameLogic(setup);
    this.subscriptions = [
      this.logic.error$.subscribe(e => e && this.toastr.error(e.message)),
      this.logic.gameOver$.subscribe(e => {
        this.gameOverReason = e;
        if (e) {
          this.end();
        }
      }),
      this.logic.drawDeckDepleted$.subscribe(player => {
        if (player) {
          this.toastr.info(`Player ${player.name} depleted the draw deck.`, 'Last round');
        }
      }),
      this.logic.gameFinished$.subscribe(player => {
        if (player) {
          this.toastr.success(`Congratulations! Player ${player.name} finished the last firework!`, 'You won!');
          this.end();
        }
      })
    ];
  }

  end(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.logic = undefined;
  }
}
