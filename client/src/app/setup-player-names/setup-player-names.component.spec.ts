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
});
