import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Campaign } from 'src/app/common/campaign';
import { CampaignDto } from 'src/app/common/campaign-dto';
import { RewardDto } from 'src/app/common/reward-dto';
import { User } from 'src/app/common/user';
import { AwsService } from 'src/app/services/aws.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css'],
})
export class CreateCampaignComponent implements OnInit {
  createCampaignFormGroup!: FormGroup;

  user!: User;
  isAuthenticated: boolean = false;
  duration: number = 0;
  goal: number = 0;
  minimumInvestment: number = 0;
  errorMessage: string = '';
  options: string[] = [
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
  selectedIndex: number = -1;
  active: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private userService: UserService,
    private awsService: AwsService
  ) {}

  ngOnInit(): void {
    this.createCampaignFormGroup = this.formBuilder.group({
      companyName: ['', Validators.required],
      title: ['', Validators.required],
      youtubeLink: ['', Validators.required],
      minimumInvestment: ['', Validators.required],
      goal: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required],
      holderName: ['', Validators.required],
      bankIndentifier: ['', Validators.required],
      accountNumber: ['', Validators.required],
      rewards: this.formBuilder.array([
        this.formBuilder.group({
          name: ['', Validators.required],
          price: ['', Validators.required],
          description: ['', Validators.required],
          image: [null, Validators.required],
        }),
      ]),
    });

    if (localStorage.getItem('userdetails') !== null) {
      this.user = JSON.parse(localStorage.getItem('userdetails')!);
      if (this.user.authStatus === 'AUTH') {
        this.isAuthenticated = true;
      }
    }

    this.initializeSelect();
  }

  onSubmit() {
    if (!this.createCampaignFormGroup.valid || this.selectedIndex == -1) {
      this.createCampaignFormGroup.markAllAsTouched();
      this.errorMessage = 'All fields are required.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (this.createCampaignFormGroup.value.goal < 500) {
      this.errorMessage = 'Goal must be greater than 500 €';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      !this.isYouTubeLinkValid(this.createCampaignFormGroup.value.youtubeLink)
    ) {
      this.errorMessage = ' Please enter a valid YouTube link';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.errorMessage = '';
      let data = this.createCampaignFormGroup.value;
      let videoId = this.extractVideoId(data.youtubeLink);
      let rewardImages: File[] = [];

      let formattedUrl = `https://www.youtube.com/embed/${videoId}`;

      let campaign = new Campaign(
        data.companyName,
        data.title,
        data.description,
        formattedUrl,
        'OPEN',
        this.formatDate(new Date()),
        '',
        [],
        data.minimumInvestment,
        data.goal,
        data.duration,
        this.options[this.selectedIndex],
        data.holderName,
        data.bankIndentifier,
        data.accountNumber,
        data.rewards
      );

      let campaignDto = new CampaignDto(
        campaign.companyName,
        campaign.title,
        campaign.description,
        campaign.youtubeLink,
        campaign.state,
        campaign.dateCreated,
        campaign.dateEnded,
        campaign.investments,
        campaign.minimumInvestment,
        campaign.goal,
        campaign.duration,
        this.options[this.selectedIndex],
        campaign.holderName,
        campaign.bankIndentifier,
        campaign.accountNumber,
        this.user.email
      );

      campaign.rewards.forEach((reward) => {
        if (reward.image) {
          rewardImages.push(reward.image);
        }
      });
      console.log(campaignDto);

      // Upload images to AWS S3
      if (rewardImages.length > 0) {
        this.awsService.uploadImages(rewardImages).subscribe(
          (response) => {
            console.log('Files uploaded successfully:', response);

            for (let i = 0; i < response.length; i++) {
              campaignDto.rewards.push(
                new RewardDto(
                  campaign.rewards[i].name,
                  campaign.rewards[i].price,
                  response[i],
                  campaign.rewards[i].description
                )
              );
            }

            this.campaignService.createCampaign(campaignDto).subscribe({
              next: (response: any) => {
                this.userService.findUser(this.user.email).subscribe((data) => {
                  data.authStatus = 'AUTH';
                  this.user = data;
                  this.user.campaigns!.push(response);

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

                  this.userService.saveUser(responseUser).subscribe({
                    next: (response: any) => {
                      this.resetFieldsForm();
                      localStorage.setItem(
                        'userdetails',
                        JSON.stringify(this.user)
                      );
                      this.selectedIndex = -1;
                      const selectedOption = document.querySelector(
                        '.selected_option'
                      ) as HTMLElement;
                      if (selectedOption) {
                        selectedOption.innerHTML = 'Select a category';
                      }
                      this.closeSelect();
                    },
                    error: (err: any) => {
                      console.error(`There was an error: ${err.message}`);
                    },
                  });
                });
              },
              error: (err: any) => {
                console.error(`There was an error: ${err.message}`);
              },
            });
          },
          (error) => {
            console.error('Error uploading files:', error);
          }
        );
      } else {
        this.campaignService.createCampaign(campaignDto).subscribe({
          next: (response: any) => {
            this.userService.findUser(this.user.email).subscribe((data) => {
              data.authStatus = 'AUTH';
              this.user = data;
              this.user.campaigns!.push(response);

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

              this.userService.saveUser(responseUser).subscribe({
                next: (response: any) => {
                  this.resetFieldsForm();
                  localStorage.setItem(
                    'userdetails',
                    JSON.stringify(this.user)
                  );
                  this.selectedIndex = -1;
                  const selectedOption = document.querySelector(
                    '.selected_option'
                  ) as HTMLElement;
                  if (selectedOption) {
                    selectedOption.innerHTML = 'Select a category';
                  }
                  this.closeSelect();
                },
                error: (err: any) => {
                  console.error(`There was an error: ${err.message}`);
                },
              });
            });
          },
          error: (err: any) => {
            console.error(`There was an error: ${err.message}`);
          },
        });
      }
    }
  }

  resetFieldsForm() {
    this.createCampaignFormGroup.reset({
      companyName: '',
      title: '',
      youtubeLink: '',
      minimumInvestment: '',
      description: '',
    });
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

  extractVideoId(url: string): string {
    let match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/
    );
    if (match) {
      return match[1];
    } else {
      return '';
    }
  }

  adjustValue(
    event: Event,
    controlName: string,
    rewards: boolean = false,
    i: number = -1
  ) {
    const target = event.target as HTMLInputElement;
    let control = this.createCampaignFormGroup.get(controlName);
    if (rewards == true) {
      control = (this.createCampaignFormGroup.get('rewards') as FormArray)
        .at(i)
        .get(controlName);
    }
    if (!target || !control) {
      return;
    }

    const value = parseInt(target.value, 10);
    const min = parseInt(target.min, 10);
    const max = parseInt(target.max, 10);

    if (value < min) {
      target.value = min.toString();

      control.setValue(min);
    } else if (value > max) {
      target.value = max.toString();
      control.setValue(max);
    }
    if (control) {
    }
  }

  addReward() {
    const rewardsArray = this.createCampaignFormGroup.get(
      'rewards'
    ) as FormArray;
    if (!rewardsArray.invalid) {
      rewardsArray.push(this.createRewardForm());
    }
  }

  createRewardForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
    });
  }

  onFileChange(event: any, index: number) {
    const rewardsArray = this.createCampaignFormGroup.get(
      'rewards'
    ) as FormArray;
    const imageControl = rewardsArray.at(index).get('image');

    if (imageControl) {
      if (event.target.files && event.target.files.length) {
        const file = event.target.files[0];
        imageControl.setValue(file);
        this.createCampaignFormGroup.updateValueAndValidity();
      }
    }
  }

  rewardsFormGroups() {
    return this.createCampaignFormGroup.get('rewards') as FormArray;
  }

  removeItem(index: any) {
    const items = this.createCampaignFormGroup.get('rewards') as FormArray;
    items.removeAt(index);
  }

  onTitleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const maxLength = 60;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
      this.createCampaignFormGroup.patchValue({ title: input.value });
    }
  }

  isYouTubeLinkValid(link: string): boolean {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(link);
  }

  isMobileDevice(): boolean {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    );
  }

  initializeSelect(): void {
    if (this.isMobileDevice()) {
      const selectElement = document.querySelector('select');
      if (selectElement) {
        selectElement.addEventListener('change', () => {
          this.selectOption(selectElement.selectedIndex);
        });
      }
    }
  }

  openSelect(): void {
    this.active = !this.active;
    const ulElement = document.querySelector('.cont_select_int') as HTMLElement;
    const iconElement = document.querySelector(
      '.icon_select_mate'
    ) as HTMLElement;
    if (ulElement) {
      ulElement.style.height = this.active
        ? `${ulElement.scrollHeight}px`
        : '0px';
      if (iconElement) {
        iconElement.style.transform = this.active
          ? 'rotate(180deg)'
          : 'rotate(0deg)';
      }
    }
  }

  selectOption(index: number): void {
    this.selectedIndex = index;
    const selectedOption = document.querySelector(
      '.selected_option'
    ) as HTMLElement;
    if (selectedOption) {
      selectedOption.innerHTML = this.options[index];
    }
    this.closeSelect();
  }

  closeSelect(): void {
    this.active = false;
    const ulElement = document.querySelector('.cont_select_int') as HTMLElement;
    const iconElement = document.querySelector(
      '.icon_select_mate'
    ) as HTMLElement;
    if (ulElement) {
      ulElement.style.height = '0px';
    }
    if (iconElement) {
      iconElement.style.transform = 'rotate(0deg)';
    }
  }
}
