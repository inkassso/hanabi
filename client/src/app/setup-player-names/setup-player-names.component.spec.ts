import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPlayerNamesComponent } from './setup-player-names.setup.component';


describe(SetupPlayerNamesComponent.name, () => {
  let component: SetupPlayerNamesComponent;
  let fixture: ComponentFixture<SetupPlayerNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupPlayerNamesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPlayerNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires player names to be non-empty and unique', () => {
    component.playerNames.set({ names: ['Alice', ''] });
    expect(component.playerForm.names[0]().valid()).toBe(true);
    expect(component.playerForm.names[1]().invalid()).toBe(true);

    component.playerNames.set({ names: ['Alice', 'Alice'] });
    expect(component.playerForm.names[0]().invalid()).toBe(true);
    expect(component.playerForm.names[1]().invalid()).toBe(true);
  });

  it('converts the add row into a player input and appends a new add row', () => {
    const rowsBefore = fixture.nativeElement.querySelectorAll('.player-row');
    const addRow = rowsBefore[rowsBefore.length - 1];

    component.addPlayer(false);
    fixture.detectChanges();

    const rowsAfter = fixture.nativeElement.querySelectorAll('.player-row');
    expect(rowsAfter[2]).toBe(addRow);
    expect(rowsAfter[2].querySelector('.btn-danger')).toBeTruthy();
    expect(rowsAfter[3].querySelector('[placeholder="Player 4"]')).toBeTruthy();
  });

  it('converts the fifth player row back to the add row without replacing it', () => {
    component.playerNames.set({ names: ['Alice', 'Bob', 'Carol', 'Dylan', 'Eve'] });
    component.playerRowIds.set([0, 1, 2, 3, 4]);
    component.addRowId.set(5);
    fixture.detectChanges();

    const rowsBefore = fixture.nativeElement.querySelectorAll('.player-row');
    const fifthRow = rowsBefore[4];
    expect(fifthRow.querySelector('.btn-danger')).toBeTruthy();

    component.removePlayer(4);
    fixture.detectChanges();

    const rowsAfter = fixture.nativeElement.querySelectorAll('.player-row');
    expect(rowsAfter).toHaveLength(5);
    expect(rowsAfter[4]).toBe(fifthRow);
    expect(rowsAfter[4].querySelector('.btn-danger')).toBeFalsy();
    expect(rowsAfter[4].querySelector('[placeholder="Player 5"]')).toBeTruthy();
  });
});
