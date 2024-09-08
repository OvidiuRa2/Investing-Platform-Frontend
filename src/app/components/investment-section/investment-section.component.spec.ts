import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentSectionComponent } from './investment-section.component';

describe('InvestmentSectionComponent', () => {
  let component: InvestmentSectionComponent;
  let fixture: ComponentFixture<InvestmentSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentSectionComponent]
    });
    fixture = TestBed.createComponent(InvestmentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
