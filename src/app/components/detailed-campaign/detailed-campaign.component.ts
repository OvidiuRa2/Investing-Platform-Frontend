import { Component, OnInit } from '@angular/core';
import { CampaignDto } from 'src/app/common/campaign-dto';
import { User } from 'src/app/common/user';
import { CampaignService } from 'src/app/services/campaign.service';
import { ObjectTransferService } from 'src/app/services/object-transfer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detailed-campaign',
  templateUrl: './detailed-campaign.component.html',
  styleUrls: ['./detailed-campaign.component.css'],
})
export class DetailedCampaignComponent implements OnInit {
  receivedCampaign!: CampaignDto;
  user!: User;
  isAuthenticated: boolean = false;
  phoneNumber!: string;
  email!: string;
  totalInvested!: number;
  daysRemained!: number;
  checkCampaignInterval!: any;

  constructor(
    private objectTransferService: ObjectTransferService,
    private userService: UserService,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.objectTransferService.campaignObject.subscribe((obj) => {
      this.receivedCampaign = obj;
    });

    if (this.receivedCampaign.dateCreated === '') {
      this.receivedCampaign = JSON.parse(
        localStorage.getItem('detailedCampaign')!
      );
    } else {
      localStorage.setItem(
        'detailedCampaign',
        JSON.stringify(this.receivedCampaign)
      );
    }

    if (localStorage.getItem('userdetails') !== null) {
      this.daysRemaining();

      this.checkCampaignInterval = setInterval(() => {
        this.daysRemaining();
      }, 30 * 60 * 1000);
    }

    if (localStorage.getItem('userdetails') !== null) {
      this.user = JSON.parse(localStorage.getItem('userdetails')!);
      if (this.user.authStatus === 'AUTH') {
        this.isAuthenticated = true;
      }
    }

    this.userService.findUser(this.receivedCampaign.createdByUser).subscribe({
      next: (response: any) => {
        if (response !== null) {
          this.phoneNumber = response.phoneNumber;
          this.email = response.email;
        }
      },
      error: (err: any) => {
        console.error(`There was an error: ${err.message}`);
      },
    });

    this.totalInvested = this.receivedCampaign.investments.reduce(
      (total, inv) => total + inv.amountInvestedStartup,
      0
    );

    this.receivedCampaign.investments.forEach((investment) => {
      if (investment.rewardsSelected.length != 0) {
        investment.rewardsSelected.forEach(
          (reward) =>
            (this.totalInvested +=
              reward.quantity * reward.rewardSelected.price)
        );
      }
    });
  }

  daysRemaining() {
    const currentDate = new Date();
    const createdDate = new Date(this.receivedCampaign.dateCreated);

    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const durationInMilliseconds =
      this.receivedCampaign.duration * millisecondsInDay;

    const differenceInDays = Math.floor(
      (createdDate.getTime() + durationInMilliseconds - currentDate.getTime()) /
        millisecondsInDay
    );

    if (differenceInDays < 0) {
      this.daysRemained = 0;

      if (
        this.receivedCampaign.dateEnded == '' ||
        this.receivedCampaign.dateEnded == null
      ) {
        clearInterval(this.checkCampaignInterval);
        this.receivedCampaign.state = 'CLOSED';
        this.receivedCampaign.dateEnded = this.formatDate(new Date());

        this.campaignService.createCampaign(this.receivedCampaign).subscribe({
          next: (response: any) => {
            this.receivedCampaign = response;
          },
          error: (err: any) => {
            console.error(`There was an error: ${err.message}`);
          },
        });
      }
    } else {
      this.daysRemained = differenceInDays + 1;
    }
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
}
