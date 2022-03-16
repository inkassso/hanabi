import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output()
  hintRequest = new EventEmitter<IHintRequest>();

  readonly isColorful = isColorful;
  readonly allSingleColors = cardColors;

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
      this.flippedColorful = card;
    }
  }
}
