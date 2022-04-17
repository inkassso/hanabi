import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { range } from 'rxjs';

@Component({
  selector: 'app-setup-player-names',
  templateUrl: './setup-player-names.component.html',
  styleUrls: ['./setup-player-names.component.sass']
})
export class SetupPlayerNamesComponent implements OnInit {

  @Input()
  minPlayers = 2;

  @Input()
  maxPlayers = 5;

  @Input()
  defaultPlayers: number = this.minPlayers;

  @Output()
  names = new EventEmitter<string[]>();

  @ViewChildren('nameInput')
  nameInputs!: QueryList<ElementRef>;

  formGroup = new FormGroup({
    names: new FormArray([])
  });

  get nameControls(): FormArray {
    return this.formGroup.controls['names'] as FormArray;
  }

  ngOnInit(): void {
    if (this.defaultPlayers < this.minPlayers) {
      throw new Error(`Minimum of ${this.minPlayers} players must be playing`);
    }
    range(0, this.defaultPlayers).subscribe(() => this.addPlayer(false));
    setTimeout(() => this.nameInputs.first.nativeElement.focus());
  }

  removePlayer(index: number): void {
    this.nameControls.removeAt(index);
  }

  addPlayer(focus: boolean = true): void {
    this.nameControls.push(new FormControl(undefined, [Validators.required]));
    if (focus) {
      const index = this.nameControls.length - 1;
      setTimeout(() => this.nameInputs.get(index)!.nativeElement.focus());
    }
  }

  confirmPlayers(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.names.emit(this.nameControls.value as string[]);
  }

  onDragDrop(e: CdkDragDrop<CdkDrag>): void {
    const names = this.nameControls;
    moveItemInArray(names.controls, e.previousIndex, e.currentIndex);
    names.updateValueAndValidity();
  }
}
