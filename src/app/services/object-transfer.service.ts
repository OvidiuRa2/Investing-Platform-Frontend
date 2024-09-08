import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Campaign } from '../common/campaign';
import { CampaignDto } from '../common/campaign-dto';
import { Investment } from '../common/investment';

@Injectable({
  providedIn: 'root',
})
export class ObjectTransferService {
  private campaignSource = new BehaviorSubject<CampaignDto>(new CampaignDto());
  private investmentSource = new BehaviorSubject<Investment>(new Investment());
  campaignObject = this.campaignSource.asObservable();
  investmentObject = this.investmentSource.asObservable();

  constructor() {}

  transferCampaign(obj: CampaignDto) {
    this.campaignSource.next(obj);
  }
  transferInvestment(obj: Investment) {
    this.investmentSource.next(obj);
  }
}
