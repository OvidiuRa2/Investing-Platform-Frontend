import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignDto } from 'src/app/common/campaign-dto';
import { EmailRequest } from 'src/app/common/email-request';
import { Investment } from 'src/app/common/investment';
import { User } from 'src/app/common/user';
import { CampaignService } from 'src/app/services/campaign.service';
import { EmailService } from 'src/app/services/email.service';
import { InvestmentService } from 'src/app/services/investment.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.css'],
})
export class AddInvestmentComponent implements OnInit {
  receivedInvestment!: Investment;
  receivedCampaign!: CampaignDto;
  user!: User;

  constructor(
    private router: Router,
    private investmentService: InvestmentService,
    private campaignService: CampaignService,
    private userService: UserService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.clearStorage();

    this.userService.findUser(this.user.email).subscribe((data) => {
      this.user = data;
      this.campaignService
        .getCampaign(Object.values(this.receivedCampaign)[0])
        .subscribe((data) => {
          this.receivedCampaign = data;
          //salvare investitie
          this.investmentService
            .createInvestment(this.receivedInvestment)
            .subscribe({
              next: (response: any) => {
                this.receivedCampaign.investments.push(response);
                this.user.investments.push(response);
                this.receivedInvestment = response;
                //update campanie cu investitie
                this.campaignService
                  .createCampaign(this.receivedCampaign)
                  .subscribe({
                    next: (response: any) => {},
                    error: (err: any) => {
                      console.error(`There was an error: ${err.message}`);
                    },
                  });
                let responseUser = new User(
                  this.user.name,
                  this.user.email,
                  this.user.password,
                  this.user.phoneNumber
                );
                responseUser.campaigns = this.user.campaigns;
                responseUser.investments = this.user.investments;
                responseUser.imageUrl = this.user.imageUrl;
                responseUser.role = this.user.role;
                //update user cu investitie
                this.userService.saveUser(responseUser).subscribe({
                  next: (response: any) => {
                    localStorage.setItem(
                      'userdetails',
                      JSON.stringify(this.user)
                    );

                    //update campanie pentru userul care a creat o
                    this.investmentService
                      .addInvestmentToUserCampaign(
                        this.receivedInvestment,
                        Object.values(this.receivedCampaign)[0]
                      )
                      .subscribe({
                        next: (response: any) => {
                          this.userService
                            .findUser(this.user.email)
                            .subscribe((res: any) => {
                              res.authStatus = 'AUTH';
                              localStorage.setItem(
                                'userdetails',
                                JSON.stringify(res)
                              );
                            });
                        },
                        error: (err: any) => {
                          console.error(`There was an error: ${err.message}`);
                        },
                      });
                  },
                  error: (err: any) => {
                    console.error(`There was an error: ${err.message}`);
                  },
                });
              },
              error: (err: any) => {
                console.error(`There was an error: ${err.message}`);
              },
            });
        });
    });

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your investment has been successfully made!',
    });
    let emailRequest = new EmailRequest(this.user.name, this.user.email, '');

    this.emailService.sendEmailSuccessfulInvestment(emailRequest).subscribe(
      (response) => {},
      (error) => {
        console.error('Error sending email', error);
      }
    );

    this.router.navigate(['/home']);
  }

  getData() {
    this.receivedInvestment = JSON.parse(localStorage.getItem('investment')!);
    this.receivedCampaign = JSON.parse(
      localStorage.getItem('investmentCampaign')!
    );
    this.user = JSON.parse(localStorage.getItem('investmentUser')!);
  }

  clearStorage() {
    localStorage.removeItem('investment');
    localStorage.removeItem('investmentCampaign');
    localStorage.removeItem('investmentUser');
    localStorage.removeItem('detailedCampaign');
  }
}
