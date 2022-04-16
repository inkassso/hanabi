import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupPlayerNamesComponent } from './setup-player-names.setup.component';


describe(SetupPlayerNamesComponent.name, () => {
  let component: SetupPlayerNamesComponent;
  let fixture: ComponentFixture<SetupPlayerNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetupPlayerNamesComponent]
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
});
