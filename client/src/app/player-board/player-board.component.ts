import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Player } from '../types';
import { PlayerHandComponent } from '../player-hand/player-hand.component';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.sass'],
  imports: [PlayerHandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBoardComponent {
  readonly players = input<Player[]>([]);
  readonly activePlayer = input<Player>();
  readonly disableOtherPlayers = signal(false);
}
