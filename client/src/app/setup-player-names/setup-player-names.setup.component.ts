import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, effect, ElementRef, input, output, viewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ArrayValidators } from './array.validators';

@Component({
  selector: 'app-setup-player-names',
  templateUrl: './setup-player-names.component.html',
  styleUrls: ['./setup-player-names.component.sass'],
  standalone: false
})
export class SetupPlayerNamesComponent {
  readonly minPlayers = input(2);
  readonly maxPlayers = input(5);
  readonly defaultPlayers = input<number>();
  readonly names = output<string[]>();
  readonly nameInputs = viewChildren<ElementRef<HTMLInputElement>>('nameInput');

  formGroup = new FormGroup({
    names: new FormArray<FormControl<string>>([], ArrayValidators.unique)
  });

  private readonly defaultPlayersEffect = effect(() => {
    const minPlayers = this.minPlayers();
    const maxPlayers = this.maxPlayers();
    const defaultPlayers = this.defaultPlayers() ?? minPlayers;
    if (defaultPlayers < minPlayers || defaultPlayers > maxPlayers) {
      throw new Error(`Default player count must be between ${minPlayers} and ${maxPlayers}`);
    }
    while (this.nameControls.length < defaultPlayers) {
      this.addPlayer(false);
    }
    while (this.nameControls.length > defaultPlayers) {
      this.nameControls.removeAt(this.nameControls.length - 1);
    }
    setTimeout(() => this.nameInputs()[0]?.nativeElement.focus());
  });

  get nameControls(): FormArray<FormControl<string>> {
    return this.formGroup.controls.names;
  }

  removePlayer(index: number): void {
    this.nameControls.removeAt(index);
  }

  addPlayer(focus: boolean = true): void {
    this.nameControls.push(new FormControl('', { nonNullable: true, validators: [Validators.required] }));
    if (focus) {
      const index = this.nameControls.length - 1;
      setTimeout(() => this.nameInputs()[index]?.nativeElement.focus());
    }
  }

  confirmPlayers(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.names.emit(this.nameControls.value);
  }

  onDragDrop(e: CdkDragDrop<CdkDrag>): void {
    const names = this.nameControls;
    moveItemInArray(names.controls, e.previousIndex, e.currentIndex);
    names.updateValueAndValidity();
  }
}
