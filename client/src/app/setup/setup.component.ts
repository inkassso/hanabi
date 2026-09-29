import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { GameSetup } from '../types/setup';
import { SetupPlayerNamesComponent } from '../setup-player-names/setup-player-names.setup.component';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.sass'],
  imports: [SetupPlayerNamesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetupComponent {

  readonly defaultRows = input(3);
  readonly setUp = output<GameSetup>();

  nextStep(playerNames: string[]): void {
    this.setUp.emit({ playerNames });
  }
}
