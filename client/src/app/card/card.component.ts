import { Component, Input, OnInit } from '@angular/core';
import { Card, CardColor, colorToBootstrap } from '../types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass']
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  card: Card | undefined;

  @Input()
  isFlipped = false;

  private readonly colorToBootstrapFont: { [color in CardColor]: string } = {
    blue: 'text-light',
    green: 'text-light',
    red: 'text-light',
    white: 'text-dark',
    yellow: 'text-dark',
    colorful: 'text-light'
  };

  get colorClasses(): string[] | undefined {
    if (!this.card) {
      return undefined;
    }
    return [
      'bg-' + colorToBootstrap[this.card.color],
      this.colorToBootstrapFont[this.card.color]
    ];
  }
}
