import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, style, transition, trigger } from '@angular/animations';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, Injector, input, output, signal, viewChildren } from '@angular/core';
import { FormField, applyEach, form, required, submit, validate } from '@angular/forms/signals';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-setup-player-names',
  templateUrl: './setup-player-names.component.html',
  styleUrls: ['./setup-player-names.component.sass'],
  imports: [FormField, NgxBootstrapIconsModule, DragDropModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('playerRow', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(0.5rem)' }),
        animate('260ms cubic-bezier(0.2, 0.75, 0.3, 1)', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, marginTop: 0, marginBottom: 0, opacity: 0, transform: 'translateY(-0.5rem)' }))
      ])
    ]),
    trigger('validationMessage', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(-0.25rem)' }),
        animate('1s', style({ height: 0, opacity: 0, transform: 'translateY(-0.25rem)' })),
        animate('180ms ease-out', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('140ms ease-in', style({ height: 0, opacity: 0, transform: 'translateY(-0.25rem)' }))
      ])
    ])
  ]
})
export class SetupPlayerNamesComponent {
  readonly minPlayers = input(2);
  readonly maxPlayers = input(5);
  readonly defaultPlayers = input<number>();
  readonly names = output<string[]>();
  readonly nameInputs = viewChildren<ElementRef<HTMLInputElement>>('nameInput');
  readonly playerRowIds = signal<number[]>([]);
  readonly suppressValidationForRow = signal<number | undefined>(undefined);
  private nextPlayerRowId = 0;
  readonly addRowId = signal(this.nextPlayerRowId++);
  readonly displayedRowIds = computed(() => this.playerNames().names.length < this.maxPlayers()
    ? [...this.playerRowIds(), this.addRowId()]
    : this.playerRowIds());
  private readonly injector = inject(Injector);

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
    this.playerRowIds.update(ids => [
      ...ids.slice(0, defaultPlayers),
      ...Array.from({ length: Math.max(0, defaultPlayers - ids.length) }, () => this.nextPlayerRowId++)
    ]);
    setTimeout(() => this.nameInputs()[0]?.nativeElement.focus());
  });

  removePlayer(index: number): void {
    const playerCount = this.playerNames().names.length;
    const removedRowId = this.playerRowIds()[index];
    if (playerCount === this.maxPlayers() && index === playerCount - 1 && removedRowId !== undefined) {
      this.addRowId.set(removedRowId);
    }
    this.playerNames.update(model => ({
      names: model.names.filter((_, currentIndex) => currentIndex !== index)
    }));
    this.playerRowIds.update(ids => ids.filter((_, currentIndex) => currentIndex !== index));
    this.suppressValidationForRow.set(undefined);
  }

  preparePlayerRemoval(rowId: number): void {
    this.suppressValidationForRow.set(rowId);
  }

  addPlayer(focus: boolean = true): void {
    const newPlayerId = this.addRowId();
    this.playerNames.update(model => ({ names: [...model.names, ''] }));
    this.playerRowIds.update(ids => [...ids, newPlayerId]);
    this.addRowId.set(this.nextPlayerRowId++);
    const index = this.playerNames().names.length - 1;

    afterNextRender(() => {
      if (focus) {
        this.nameInputs()[index]?.nativeElement.focus();
      }
    }, { injector: this.injector });
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
      this.playerRowIds.update(ids => {
        const reorderedIds = [...ids];
        moveItemInArray(reorderedIds, event.previousIndex, event.currentIndex);
        return reorderedIds;
      });
      return { names };
    });
  }
}
