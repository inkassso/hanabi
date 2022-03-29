import { Component, Input, OnInit } from '@angular/core';
import { Card, cardColors, cardHigh, colorToBootstrap, GameBoard, SingleColor } from '../types';

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

  isFireworkFinished(color: SingleColor): boolean {
    return this.getCards(color).length >= cardHigh;
  }

  getBackgroundClass(color: SingleColor): string {
    if (!this.isFireworkEmpty(color)) {
      return '';
    }
    return 'bg-' + colorToBootstrap[color];
  }
}
