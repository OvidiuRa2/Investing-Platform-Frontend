import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { PaymentInfo } from '../common/payment-info';
import { Observable } from 'rxjs';
import { Investment } from '../common/investment';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  private investmentUrl = environment.apiUrl + '/investment';
  constructor(private httpClient: HttpClient) {}
  headers = {
    headers: new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('jwtToken')
    ),
  };

  createInvestment(investment: Investment): Observable<any> {
    return this.httpClient.post<Investment>(
      this.investmentUrl,
      investment,
      this.headers
    );
  }

  addInvestmentToUserCampaign(
    investment: Investment,
    campaignId: number
  ): Observable<any> {
    const investmentToUserCampaign = `${this.investmentUrl}/${campaignId}`;
    return this.httpClient.post<any>(
      investmentToUserCampaign,
      investment,
      this.headers
    );
  }
}
