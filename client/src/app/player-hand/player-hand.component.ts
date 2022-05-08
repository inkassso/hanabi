import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { assert, Card, CardColor, cardHigh, CardNumber, colorToBootstrap, HeldCard, isColorful, Player, SingleColor, singleColors } from '../types';

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
    trigger('slideLeftLiftUp', [
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
export class PlayerHandComponent {

  constructor() { }

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
  readonly allSingleColors = singleColors;
  readonly popoverPlacement: Placement[] = [
    'top', 'top-start', 'top-left', 'top-end', 'top-right',
    'start', 'left', 'start-top', 'left-top', 'start-bottom', 'left-bottom',
    'end', 'right', 'end-top', 'right-top', 'end-bottom', 'right-bottom'
  ];

  notifyGiveHintRequest(hc: HeldCard, hint: SingleColor | CardNumber): void {
    if (!this.player) {
      throw new Error('Player is not defined.');
    }
    this.hintRequest.next({
      to: this.player,
      card: hc.card,
      hint
    });
  }

  getButtonClass(color: CardColor): string {
    return 'btn-' + colorToBootstrap[color];
  }

  getFlipDelay(i: number): number {
    return this.isActive ? i : cardHigh - i;
  }

  flipped?: HeldCard;

  playCard(hc: HeldCard): boolean {
    const player = assert(this.player, 'Player');
    if (isColorful(hc.card.color)) {
      // only flip the card, the player has yet to choose the color
      this.flipped = hc;
      this.blockRequest.next(!!hc);
      return false;
    }
    this.delayWithCardFlip(hc, () => player.playCard(hc));
    return true;
  }

  discardCard(hc: HeldCard): void {
    const player = assert(this.player, 'Player');
    this.delayWithCardFlip(hc, () => player.discardCard(hc));
  }

  playFlippedColorful(color: SingleColor): void {
    const player = assert(this.player, 'Player');
    const flipped = assert(this.flipped, 'Flipped colorful');
    if (!isColorful(flipped.card.color)) {
      throw new Error('Flipped card is not a colorful card');
    }
    player.playCard(flipped, color);
    this.flipped = undefined;
    this.blockRequest.next(false);
  }

  isCardDisabled(hc: HeldCard): boolean {
    return this.isDisabled || (!!this.flipped && hc !== this.flipped);
  }

  private delayWithCardFlip(hc: HeldCard, action: () => any, delay: number = actionDelayMs): unknown {
    this.flipped = hc;
    return setTimeout(() => {
      try {
        action();
      } finally {
        this.flipped = undefined;
      }
    }, delay);
  }
}
