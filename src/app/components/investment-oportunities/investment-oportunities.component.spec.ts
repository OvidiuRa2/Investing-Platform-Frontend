import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentOportunitiesComponent } from './investment-oportunities.component';

describe('InvestmentOportunitiesComponent', () => {
  let component: InvestmentOportunitiesComponent;
  let fixture: ComponentFixture<InvestmentOportunitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentOportunitiesComponent]
    });
    fixture = TestBed.createComponent(InvestmentOportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
