import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FireworkBoardComponent } from './firework-board.component';


describe('BoardComponent', () => {
  let component: FireworkBoardComponent;
  let fixture: ComponentFixture<FireworkBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FireworkBoardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FireworkBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
