import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card, CardColor, colorToBootstrap } from '../types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  readonly card = input<Card>();
  readonly isFlipped = input(false);
  readonly flipDelay = input(0);

  private readonly colorToBootstrapFont: { [color in CardColor]: string } = {
    blue: 'text-light',
    green: 'text-light',
    red: 'text-light',
    white: 'text-dark',
    yellow: 'text-dark',
    colorful: 'text-light'
  };
  readonly delayMultiplier = 60;

  readonly colorClasses = computed(() => {
    const card = this.card();
    if (!card) {
      return undefined;
    }
    return [
      'bg-' + colorToBootstrap[card.color],
      this.colorToBootstrapFont[card.color]
    ];
  });
}
