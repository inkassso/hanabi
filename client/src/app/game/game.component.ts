import { Component, OnInit } from '@angular/core';
import { Card } from './card';
import { GameLogic } from './logic';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {

  logic?: GameLogic;

  ngOnInit(): void {
    this.logic = new GameLogic(['Lucas', 'George']);
  }

  getCardClasses(card: Card): string[] {
    return [card.color];
  }
}
