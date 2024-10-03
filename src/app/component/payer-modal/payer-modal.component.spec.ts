import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerModalComponent } from './payer-modal.component';

describe('PayerModalComponent', () => {
  let component: PayerModalComponent;
  let fixture: ComponentFixture<PayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
