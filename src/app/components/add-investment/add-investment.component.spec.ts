import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvestmentComponent } from './add-investment.component';

describe('AddInvestmentComponent', () => {
  let component: AddInvestmentComponent;
  let fixture: ComponentFixture<AddInvestmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddInvestmentComponent]
    });
    fixture = TestBed.createComponent(AddInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
