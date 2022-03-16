import { Component, Input, OnInit } from '@angular/core';
import { Card, colorBackgrounds } from '../types';

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

  get colorClass(): string | undefined {
    if (!this.card) {
      return undefined;
    }
    return colorBackgrounds[this.card.color];
  }
}
