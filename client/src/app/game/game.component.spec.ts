import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';


describe(GameComponent.name, () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the setup screen available before a game starts', () => {
    expect(fixture.nativeElement.querySelector('app-setup')).toBeTruthy();
  });

  it('requires explicit confirmation before aborting', () => {
    component.requestAbort();
    expect(component.confirmingAbort()).toBe(true);

    component.cancelAbort();
    expect(component.confirmingAbort()).toBe(false);
  });
});
