import { Component, input, signal } from '@angular/core';
import { Player } from '../types';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.sass'],
  standalone: false
})
export class PlayerBoardComponent {
  readonly players = input<Player[]>([]);
  readonly activePlayer = input<Player>();
  readonly disableOtherPlayers = signal(false);
}
