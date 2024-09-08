import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotingSectionComponent } from './promoting-section.component';

describe('PromotingSectionComponent', () => {
  let component: PromotingSectionComponent;
  let fixture: ComponentFixture<PromotingSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotingSectionComponent]
    });
    fixture = TestBed.createComponent(PromotingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
