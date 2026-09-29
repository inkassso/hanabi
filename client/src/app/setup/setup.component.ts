import { Component, input, output } from '@angular/core';
import { GameSetup } from '../types/setup';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.sass'],
  standalone: false
})
export class SetupComponent {

  readonly defaultRows = input(3);
  readonly setUp = output<GameSetup>();

  nextStep(playerNames: string[]): void {
    this.setUp.emit({ playerNames });
  }
}
