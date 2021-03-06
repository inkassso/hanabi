import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerHandComponent } from './player-hand.component';


describe(PlayerHandComponent.name, () => {
  let component: PlayerHandComponent;
  let fixture: ComponentFixture<PlayerHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerHandComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
