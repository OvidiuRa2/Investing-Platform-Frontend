import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CampaignDto } from '../common/campaign-dto';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private baseUrl = environment.apiUrl + `/campaign`;
  constructor(private httpClient: HttpClient) {}

  getCampaignsPaginate(thePage: number, thePageSize: number): Observable<any> {
    const searchUrl = `${this.baseUrl}/all?page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseCampaigns>(searchUrl);
  }

  getCampaign(theCampaignId: number): Observable<CampaignDto> {
    const campaignUrl = `${this.baseUrl}/${theCampaignId}`;

    return this.httpClient.get<CampaignDto>(campaignUrl);
  }

  createCampaign(campaign: CampaignDto): Observable<any> {
    const headers = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('jwtToken')
      ),
    };

    const createCampaignUrl = `${this.baseUrl}`;

    return this.httpClient.post(createCampaignUrl, campaign, headers);
  }

  findCampaingByInvestmentId(investmentId: any): Observable<any> {
    const investmentToUserCampaign = `${this.baseUrl}/findCampaign/${investmentId}`;
    return this.httpClient.get<any>(investmentToUserCampaign);
  }

  findCampaignsByTitleAndCategoryPaginate(
    title: any,
    category: any,
    thePage: number,
    thePageSize: number
  ): Observable<any> {
    const findCampaignsByTitleAndCategoryPaginate = `${this.baseUrl}/search?title=${title}&category=${category}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<any>(findCampaignsByTitleAndCategoryPaginate);
  }
}

interface GetResponseCampaigns {
  _embedded: {
    campaigns: CampaignDto[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
