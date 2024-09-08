import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Campaign } from 'src/app/common/campaign';
import { CampaignDto } from 'src/app/common/campaign-dto';
import { CampaignService } from 'src/app/services/campaign.service';
import { ObjectTransferService } from 'src/app/services/object-transfer.service';

@Component({
  selector: 'app-investment-oportunities',
  templateUrl: './investment-oportunities.component.html',
  styleUrls: ['./investment-oportunities.component.css'],
})
export class InvestmentOportunitiesComponent implements OnInit {
  thePageNumber: number = 1;
  thePageSize: number = 6;
  theTotalElements: number = 0;
  campaigns: CampaignDto[] = [];
  showAlert: boolean = false;
  categories: string[] = [
    'Technology',
    'Education',
    'Health',
    'Art',
    'Energy and Environment',
    'Food and Agriculture',
    'Fashion and Design',
    'Sports and Fitness',
    'Transport and Mobility',
  ];
  searchTitle: string = '';
  selectedCategory: string = '';

  constructor(
    private campaignService: CampaignService,
    private objectTransferService: ObjectTransferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listCampaigns('', '');

    setTimeout(() => {
      this.showAlert = true;
    }, 2000);
  }

  listCampaigns(title: string, category: string) {
    this.campaignService
      .findCampaignsByTitleAndCategoryPaginate(
        title,
        category,
        this.thePageNumber - 1,
        this.thePageSize
      )

      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.campaigns = data.content;
      this.thePageNumber = data.pageable.pageNumber + 1;
      this.thePageSize = data.pageable.pageSize;
      this.theTotalElements = data.totalElements;
    };
  }

  sendObject(campaignTransfer: CampaignDto) {
    this.objectTransferService.transferCampaign(campaignTransfer);
    this.router.navigateByUrl('/detailedCampaign');
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listCampaigns(this.searchTitle, this.selectedCategory);
  }

  filterCampaigns(category: string) {
    this.selectedCategory = category;
    this.listCampaigns(this.searchTitle, this.selectedCategory);
  }
}
