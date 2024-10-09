import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllExpensesViewComponent } from './all-expenses-view.component';

describe('AllExpensesViewComponent', () => {
  let component: AllExpensesViewComponent;
  let fixture: ComponentFixture<AllExpensesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllExpensesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllExpensesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
