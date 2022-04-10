import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Card, cardColors, cardHigh, colorToBootstrap, GameBoard, SingleColor } from '../types';

@Component({
  selector: 'app-board',
  templateUrl: './firework-board.component.html',
  styleUrls: ['./firework-board.component.sass'],
  animations: [
    trigger('throwDown', [
      transition(':enter', [
        style({
          transform: 'scale(200%)',
          opacity: 0
        }),
        animate('300ms ease')
      ])
    ]),
    trigger('popUp', [
      transition(':enter', [
        style({
          transform: 'scale(50%)',
          opacity: 0
        }),
        animate('200ms 300ms ease-out', style({ // 300ms delay is due to the card scaleDown animation
          transform: 'scale(150%)',
          opacity: 0.8
        })),
        animate('100ms ease-in')
      ])
    ])
  ]
})
export class FireworkBoardComponent {

  constructor() { }

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
