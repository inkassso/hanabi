import { Component, Input, OnInit } from '@angular/core';
import { Card, cardColors, GameBoard, SingleColor } from '../types';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  board: GameBoard | undefined;

  allSingleColors = cardColors;

  getCards(color: SingleColor): Card[] {
    return this.board?.table[color] ?? [];
  }

  isFireworkEmpty(color: SingleColor): boolean {
    return this.getCards(color).length === 0;
  }

  getCardSlotClasses(color: SingleColor): string | string[] | { [prop: string]: boolean } {
    return {
      [color]: this.isFireworkEmpty(color),
    };
  }
}
