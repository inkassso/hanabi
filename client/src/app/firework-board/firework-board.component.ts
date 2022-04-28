import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Card, cardHigh, colorToBootstrap, Fireworks, SingleColor, singleColors } from '../types';

@Component({
  selector: 'app-firework-board',
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
  fireworks?: Fireworks;

  allSingleColors = singleColors;

  getCards(color: SingleColor): readonly Card[] {
    return (this.fireworks && this.fireworks[color]) ?? [];
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
