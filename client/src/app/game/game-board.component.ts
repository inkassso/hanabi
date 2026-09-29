import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FireworkBoardComponent } from '../firework-board/firework-board.component';
import { GameLogic } from '../types';
import { PlayerBoardComponent } from '../player-board/player-board.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.sass'],
  imports: [FireworkBoardComponent, PlayerBoardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent {
  readonly game = input.required<GameLogic>();
}
