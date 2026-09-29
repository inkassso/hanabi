import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from '../types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  readonly card = input<Card>();
  readonly isFlipped = input(false);
  readonly flipDelay = input(0);

  readonly delayMultiplier = 60;

  readonly colorClasses = computed(() => {
    const card = this.card();
    if (!card) {
      return undefined;
    }
    return 'hanabi-card-' + card.color;
  });
}
