import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Placement } from '@ng-bootstrap/ng-bootstrap';
import { Card, CardColor, cardColors, CardNumber, colorToBootstrap, isColorful, Player, SingleColor } from '../types';

export interface IHintRequest {
  to: Player;
  card: Card;
  hint: SingleColor | CardNumber;
}

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.sass']
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
  notifyFlip = new EventEmitter<boolean>();

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

  flippedColorful?: Card;

  playCard(card: Card): void {
    if (!this.player) {
      throw new Error('Player not defined');
    }
    if (!isColorful(card.color)) {
      this.player.playCard(card);
    }
    else {
      this.setFlippedColorful(card);
    }
  }

  playFlippedColorful(color: SingleColor): void {
    if (!this.player) {
      throw new Error('Player not defined');
    }
    if (!this.flippedColorful) {
      throw new Error('No colorful card flipped');
    }
    this.player.playCard(this.flippedColorful, color);
    this.setFlippedColorful();
  }

  isCardDisabled(card: Card): boolean {
    return this.isDisabled || (!!this.flippedColorful && card !== this.flippedColorful);
  }

  private setFlippedColorful(card?: Card): void {
    this.flippedColorful = card;
    this.notifyFlip.next(!!card);
  }
}
