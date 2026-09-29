import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, signal, viewChildren } from '@angular/core';
import { FormField, applyEach, form, required, submit, validate } from '@angular/forms/signals';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-setup-player-names',
  templateUrl: './setup-player-names.component.html',
  styleUrls: ['./setup-player-names.component.sass'],
  imports: [FormField, NgxBootstrapIconsModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetupPlayerNamesComponent {
  readonly minPlayers = input(2);
  readonly maxPlayers = input(5);
  readonly defaultPlayers = input<number>();
  readonly names = output<string[]>();
  readonly nameInputs = viewChildren<ElementRef<HTMLInputElement>>('nameInput');

  readonly playerNames = signal({ names: [] as string[] });
  readonly playerForm = form(this.playerNames, names => {
    applyEach(names.names, name => {
      required(name, { message: 'Name is required.' });
      validate(name, ({ value, valueOf }) => {
        const currentName = value();
        const occurrences = valueOf(names.names).filter(candidate => candidate === currentName).length;
        return currentName && occurrences > 1
          ? { kind: 'unique', message: 'Name must be unique.' }
          : undefined;
      });
    });
  });

  private readonly defaultPlayersEffect = effect(() => {
    const minPlayers = this.minPlayers();
    const maxPlayers = this.maxPlayers();
    const defaultPlayers = this.defaultPlayers() ?? minPlayers;
    if (defaultPlayers < minPlayers || defaultPlayers > maxPlayers) {
      throw new Error(`Default player count must be between ${minPlayers} and ${maxPlayers}`);
    }
    this.playerNames.update(model => ({
      names: model.names.length < defaultPlayers
        ? [...model.names, ...Array.from({ length: defaultPlayers - model.names.length }, () => '')]
        : model.names.slice(0, defaultPlayers)
    }));
    setTimeout(() => this.nameInputs()[0]?.nativeElement.focus());
  });

  removePlayer(index: number): void {
    this.playerNames.update(model => ({
      names: model.names.filter((_, currentIndex) => currentIndex !== index)
    }));
  }

  addPlayer(focus: boolean = true): void {
    this.playerNames.update(model => ({ names: [...model.names, ''] }));
    if (focus) {
      const index = this.playerNames().names.length - 1;
      setTimeout(() => this.nameInputs()[index]?.nativeElement.focus());
    }
  }

  async confirmPlayers(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.playerForm, async () => {
      this.names.emit(this.playerNames().names);
    });
  }

  onDragDrop(event: CdkDragDrop<CdkDrag>): void {
    this.playerNames.update(model => {
      const names = [...model.names];
      moveItemInArray(names, event.previousIndex, event.currentIndex);
      return { names };
    });
  }
}
