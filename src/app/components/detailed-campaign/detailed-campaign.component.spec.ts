import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedCampaignComponent } from './detailed-campaign.component';

describe('DetailedCampaignComponent', () => {
  let component: DetailedCampaignComponent;
  let fixture: ComponentFixture<DetailedCampaignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailedCampaignComponent]
    });
    fixture = TestBed.createComponent(DetailedCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
