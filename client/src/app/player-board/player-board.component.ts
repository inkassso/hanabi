import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../types';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.sass']
})
export class PlayerBoardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  players: Player[] = [];

  @Input()
  activePlayer: Player | undefined;
}
