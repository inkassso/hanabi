import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Card, cardColors, isColorful } from './card';
import { GameLogic } from './logic';
import { Player } from './player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {

  logic?: GameLogic;

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    this.logic = new GameLogic(['Lucas', 'George', 'Hayden', 'Ewan']);
    this.logic.error$.subscribe(e => e && this.toastr.error(e.message))
  }

  getCardBackgroundClass(player: Player, card: Card): string {
    if (player === this.logic?.activePlayer) {
      return '';
    }
    return card.color;
  }

  readonly isColorful = isColorful;
  readonly allSingleColors = cardColors;
}
