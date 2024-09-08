import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Campaign } from 'src/app/common/campaign';
import { CampaignDto } from 'src/app/common/campaign-dto';
import { Investment } from 'src/app/common/investment';
import { User } from 'src/app/common/user';
import { CampaignService } from 'src/app/services/campaign.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  user!: User;
  isAuthenticated: boolean = false;
  totalInvested: number = 0;
  totalRewardsSelected: number = 0;
  totalCampaignsSelected: number = 0;
  rewardsDetails: string[] = [];
  rewardMessage: string = '';
  companyNames: Map<string, any> = new Map<string, any>();
  companyNamesInvestmentsTable: string[] = [];
  rewardsSelectedCampaign!: CampaignDto;
  investmentsSelectedCampaign!: CampaignDto;
  showRewards: boolean = false;
  showInvestments: boolean = false;
  totalInvestedMap: Map<string, any> = new Map<string, any>();
  daysRemained: Map<string, any> = new Map<string, any>();
  campaignIntervals: Map<string, any> = new Map<string, any>();
  investorsNames: Map<string, any> = new Map<string, any>();

  constructor(
    private campaignService: CampaignService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('userdetails') !== null) {
      this.user = JSON.parse(localStorage.getItem('userdetails')!);
      if (this.user.authStatus === 'AUTH') {
        this.isAuthenticated = true;
      }
    }
    this.userService.findUser(this.user.email).subscribe({
      next: (response: any) => {
        this.user = response;
        if (this.user && this.user.campaigns) {
          this.user.campaigns.forEach((campaign) => {
            this.startCampaignInterval(campaign);
            this.daysRemaining(campaign);
          });
        }

        this.totalCampaignsSelected = this.user.campaigns.length;

        this.user.investments.forEach((investment) => {
          this.totalInvested += investment.amountInvestedStartup;
          this.rewardMessage = '';

          this.campaignService
            .findCampaingByInvestmentId(Object.values(investment)[0])
            .subscribe({
              next: (response: any) => {
                this.companyNames.set(
                  Object.values(investment)[0],
                  response.companyName
                );
              },
              error: (err: any) => {
                console.error(`There was an error: ${err.message}`);
              },
            });

          if (investment.rewardsSelected.length != 0) {
            investment.rewardsSelected.forEach((reward) => {
              this.totalInvested +=
                reward.quantity * reward.rewardSelected.price;
              this.rewardMessage += `${reward.rewardSelected.name} (${reward.quantity} * ${reward.rewardSelected.price}€)
`;
              this.totalRewardsSelected += 1;
            });
          }
          this.rewardMessage = this.rewardMessage.trim();
          this.rewardsDetails.push(this.rewardMessage);
        });

        this.user.campaigns.forEach((campaign) => {
          let campaignTotalInvestment = 0;
          campaign.investments.forEach((investment) => {
            campaignTotalInvestment += investment.amountInvestedStartup;

            this.userService
              .findUserByInvestmentId(Object.values(investment)[0])
              .subscribe((res) => {
                if (res == null) {
                  this.investorsNames.set(Object.values(investment)[0], '');
                } else {
                  this.investorsNames.set(
                    Object.values(investment)[0],
                    res.email
                  );
                }
              });

            if (investment.rewardsSelected.length != 0) {
              investment.rewardsSelected.forEach((reward) => {
                campaignTotalInvestment +=
                  reward.quantity * reward.rewardSelected.price;
              });
            }
          });
          this.totalInvestedMap.set(
            Object.values(campaign)[0],
            campaignTotalInvestment
          );
        });
      },
      error: (err: any) => {
        console.error(`There was an error: ${err.message}`);
      },
    });
  }

  daysRemaining(campaign: CampaignDto) {
    const currentDate = new Date();
    const createdDate = new Date(campaign.dateCreated);

    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const durationInMilliseconds = campaign.duration * millisecondsInDay;

    const differenceInDays = Math.floor(
      (createdDate.getTime() + durationInMilliseconds - currentDate.getTime()) /
        millisecondsInDay
    );

    if (differenceInDays < 0) {
      this.daysRemained.set(Object.values(campaign)[0], 0);

      if (campaign.dateEnded == '' || campaign.dateEnded == null) {
        campaign.state = 'CLOSED';
        campaign.dateEnded = this.formatDate(new Date());

        this.campaignService.createCampaign(campaign).subscribe({
          next: (response: any) => {
            campaign = response;
          },
          error: (err: any) => {
            console.error(`There was an error: ${err.message}`);
          },
        });
        this.stopCampaignInterval(Object.values(campaign)[0]);
      }
    } else {
      this.daysRemained.set(Object.values(campaign)[0], differenceInDays + 1);
    }
  }

  startCampaignInterval(campaign: CampaignDto) {
    const interval = setInterval(() => {
      this.daysRemaining(campaign);
    }, 30 * 60 * 1000);

    this.campaignIntervals.set(Object.values(campaign)[0], interval);
  }

  stopCampaignInterval(campaignId: string) {
    const interval = this.campaignIntervals.get(campaignId);
    if (interval) {
      clearInterval(interval);
      this.campaignIntervals.delete(campaignId);
    }
  }

  getDaysLeft(campaign: CampaignDto) {
    return this.daysRemained.get(Object.values(campaign)[0]);
  }

  getTotalInvestment(campaign: CampaignDto) {
    return this.totalInvestedMap.get(Object.values(campaign)[0]);
  }

  getCompanyName(investment: Investment) {
    return this.companyNames.get(Object.values(investment)[0]);
  }
  showRewardsTable(campaign: CampaignDto) {
    this.showRewards = true;
    this.rewardsSelectedCampaign = campaign;
    setTimeout(() => {
      this.scrollToSection('rewards-section');
    }, 10);
  }

  showInvestmentsTable(campaign: CampaignDto) {
    this.showInvestments = true;
    this.investmentsSelectedCampaign = campaign;
    setTimeout(() => {
      this.scrollToSection('invest-section');
    }, 10);
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  concatRewards(investment: Investment) {
    let result: string = ``;

    investment.rewardsSelected.forEach((reward) => {
      result += `${reward.rewardSelected.name} (${reward.quantity} * ${reward.rewardSelected.price}€)
`;
    });
    return result;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  findInvestorEmailByInvestmentId(investment: Investment) {
    return this.investorsNames.get(Object.values(investment)[0]);
  }
}
