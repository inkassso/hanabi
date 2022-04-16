import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameSetup } from '../types/setup';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.sass']
})
export class SetupComponent {

  @Input()
  defaultRows: number = 3;

  @Output()
  setUp = new EventEmitter<GameSetup>();

  playerNames?: string[];

  constructor() { }

  nextStep(): void {
    this.setUp.emit({
      playerNames: this.playerNames!
    });
  }

}
