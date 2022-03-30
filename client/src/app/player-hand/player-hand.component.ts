import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { assert, Card, CardColor, cardColors, cardHigh, CardNumber, colorToBootstrap, isColorful, Player, SingleColor } from '../types';

export interface IHintRequest {
  to: Player;
  card: Card;
  hint: SingleColor | CardNumber;
}

const actionDelayMs = 1800; // the flip animation takes 0.8s

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.sass'],
  animations: [
    trigger('slideLeftScaleUp', [
      transition(':enter', [
        style({
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate('300ms ease')
      ]),
      transition(':leave', [
        animate('300ms ease', style({
          transform: 'scale(200%)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class PlayerHandComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  player: Player | undefined;

  @Input()
  isActive = false;

  @Input()
  isDisabled = false;

  @Output()
  hintRequest = new EventEmitter<IHintRequest>();

  @Output()
  blockRequest = new EventEmitter<boolean>();

  readonly isColorful = isColorful;
  readonly allSingleColors = cardColors;
  readonly popoverPlacement: Placement[] = [
    'top', 'top-start', 'top-left', 'top-end', 'top-right',
    'start', 'left', 'start-top', 'left-top', 'start-bottom', 'left-bottom',
    'end', 'right', 'end-top', 'right-top', 'end-bottom', 'right-bottom'
  ];

  notifyGiveHintRequest(card: Card, hint: SingleColor | CardNumber): void {
    if (!this.player) {
      throw new Error('Player is not defined.');
    }
    this.hintRequest.next({
      to: this.player,
      card,
      hint
    });
  }

  getButtonClass(color: CardColor): string {
    return 'btn-' + colorToBootstrap[color];
  }

  getFlipDelay(i: number): number {
    return this.isActive ? i : cardHigh - i;
  }

  flipped?: Card;

  playCard(card: Card): boolean {
    const player = assert(this.player, 'Player');
    if (isColorful(card.color)) {
      // only flip the card, the player has yet to choose the color
      this.flipped = card;
      this.blockRequest.next(!!card);
      return false;
    }
    this.delayWithCardFlip(card, () => player.playCard(card));
    return true;
  }

  discardCard(card: Card): void {
    const player = assert(this.player, 'Player');
    this.delayWithCardFlip(card, () => player.discardCard(card));
  }

  playFlippedColorful(color: SingleColor): void {
    const player = assert(this.player, 'Player');
    const flipped = assert(this.flipped, 'Flipped colorful');
    if (!isColorful(flipped.color)) {
      throw new Error('Flipped card is not a colorful card');
    }
    this.delayWithCardFlip(flipped, () => {
      player.playCard(flipped, color);
      this.blockRequest.next(false);
    });
  }

  isCardDisabled(card: Card): boolean {
    return this.isDisabled || (!!this.flipped && card !== this.flipped);
  }

  private delayWithCardFlip(card: Card, action: () => any, delay: number = actionDelayMs): unknown {
    this.flipped = card;
    return setTimeout(() => {
      try {
        action();
      } finally {
        this.flipped = undefined;
      }
    }, delay);
  }
}
