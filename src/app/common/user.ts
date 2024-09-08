import { Campaign } from './campaign';
import { CampaignDto } from './campaign-dto';
import { Investment } from './investment';

export class User {
  name: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  authStatus: string = '';
  campaigns: CampaignDto[] = [];
  investments: Investment[] = [];
  role: string = 'USER';
  imageUrl: string = 'http://bootdey.com/img/Content/avatar/avatar1.png';
  constructor(
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }
}
