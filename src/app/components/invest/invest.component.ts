import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { Campaign } from 'src/app/common/campaign';
import { CampaignDto } from 'src/app/common/campaign-dto';
import { Investment } from 'src/app/common/investment';
import { Payment } from 'src/app/common/payment';
import { PaymentInfo } from 'src/app/common/payment-info';
import { RewardDto } from 'src/app/common/reward-dto';
import { RewardQuantity } from 'src/app/common/reward-quantity';
import { User } from 'src/app/common/user';
import { InvestmentService } from 'src/app/services/investment.service';
import { ObjectTransferService } from 'src/app/services/object-transfer.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css'],
})
export class InvestComponent implements OnInit {
  receivedCampaign!: CampaignDto;
  user!: User;
  isAuthenticated: boolean = false;
  companyContribution: number = 0;
  platformContribution: number = 0;
  totalContribution: number = 0;
  payments: Payment[] = [];
  quantity: number = 0;
  rewardsSelected: Map<RewardDto, number> = new Map();
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';
  rewardsList: RewardQuantity[] = [];

  stripePromise = loadStripe(environment.stripePublishableKey);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.receivedCampaign = JSON.parse(
      localStorage.getItem('detailedCampaign')!
    );

    if (localStorage.getItem('userdetails') !== null) {
      this.user = JSON.parse(localStorage.getItem('userdetails')!);
      if (this.user.authStatus === 'AUTH') {
        this.isAuthenticated = true;
      }
    }

    this.receivedCampaign.rewards.forEach((reward: any) => {
      this.rewardsSelected.set(reward, 0);
    });
  }

  async pay(): Promise<void> {
    const value = this.totalContribution - this.platformContribution;

    if (
      this.displayError !==
      ' Please complete all required fields before proceeding.'
    ) {
      if (value < this.receivedCampaign.minimumInvestment) {
        this.displayError =
          'Contribution to ' +
          this.receivedCampaign.companyName +
          ' (including rewards) must be at least ' +
          this.receivedCampaign.minimumInvestment +
          ' €';
        return;
      } else {
        this.displayError = '';
      }

      if (this.displayError === '') {
        if (this.companyContribution > 0) {
          this.payments.push(this.createCompanyContribution());
        }

        if (this.platformContribution > 0) {
          this.payments.push(this.createPlatformContribution());
        }

        for (const [reward, quantity] of this.rewardsSelected.entries()) {
          if (quantity > 0) {
            this.rewardsList.push(new RewardQuantity(quantity, reward));
            this.payments.push(
              new Payment(
                reward.name,
                'eur',
                reward.price * 100,
                quantity.toString(),
                'http://localhost:4200/invest',
                'http://localhost:4200/add-investment'
              )
            );
          }
        }
      }
    }
    if (this.payments.length !== 0) {
      const stripe = await this.stripePromise;
      if (stripe) {
        const headers = {
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer ' + localStorage.getItem('jwtToken')
          ),
        };
        this.http
          .post(`${environment.apiUrl}/payment`, this.payments, headers)
          .subscribe((data: any) => {
            stripe.redirectToCheckout({
              sessionId: data.id,
            });
            let investment = new Investment(
              this.formatDate(new Date()),
              this.companyContribution,
              this.platformContribution,
              this.rewardsList
            );
            localStorage.setItem('investment', JSON.stringify(investment));
            localStorage.setItem(
              'investmentCampaign',
              JSON.stringify(this.receivedCampaign)
            );
            localStorage.setItem('investmentUser', JSON.stringify(this.user));
          });
      }
    }
  }

  createCompanyContribution() {
    return new Payment(
      'Funding ' + this.receivedCampaign.companyName,
      'eur',
      this.companyContribution * 100,
      '1',
      'http://localhost:4200/home',
      'http://localhost:4200/add-investment'
    );
  }

  createPlatformContribution() {
    return new Payment(
      'Supporting Startup Pulse',
      'eur',
      this.platformContribution * 100,
      '1',
      'http://localhost:4200/home',
      'http://localhost:4200/add-investment'
    );
  }

  adjustValues(event: Event) {
    const target = event.target as HTMLInputElement;

    const value = parseInt(target.value, 10);
    const min = parseInt(target.min, 10);
    const max = parseInt(target.max, 10);

    if (value < min) {
      target.value = min.toString();
    } else if (value > max) {
      target.value = max.toString();
    }

    if (target.id == 'company-contribution') {
      this.companyContribution = parseInt(target.value);
    } else if (target.id == 'platform-contribution') {
      this.platformContribution = parseInt(target.value);
    }
  }

  decrementQuantity(reward: RewardDto) {
    if (
      this.rewardsSelected.has(reward) &&
      this.rewardsSelected.get(reward)! > 0
    ) {
      this.rewardsSelected.set(reward, this.rewardsSelected.get(reward)! - 1);
      this.totalContribution -= reward.price;
    }
  }
  incrementQuantity(reward: RewardDto) {
    if (this.rewardsSelected.has(reward)) {
      this.rewardsSelected.set(reward, this.rewardsSelected.get(reward)! + 1);
      this.totalContribution += reward.price;
    }
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  addContribution(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!isNaN(parseInt(target.value, 10))) {
      if (parseInt(target.value, 10) > 0) {
        this.companyContribution = parseInt(target.value, 10);
      }
      this.displayError = '';
      this.adjustValues(event);
    } else {
      this.companyContribution = 0;
      this.displayError =
        ' Please complete all required fields before proceeding.';
    }
    this.totalContribution =
      this.companyContribution + this.platformContribution;
    this.addRewards();
  }

  addContributionPlatform(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!isNaN(parseInt(target.value, 10))) {
      if (parseInt(target.value, 10) > 0) {
        this.platformContribution = parseInt(target.value, 10);
      }
      this.displayError = '';
      this.adjustValues(event);
    } else {
      this.platformContribution = 0;
      this.displayError =
        ' Please complete all required fields before proceeding.';
    }
    this.totalContribution =
      this.companyContribution + this.platformContribution;
    this.addRewards();
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

  addRewards() {
    this.rewardsSelected.forEach((value: number, rewardDto: RewardDto) => {
      this.totalContribution += rewardDto.price * value;
    });
  }
}
