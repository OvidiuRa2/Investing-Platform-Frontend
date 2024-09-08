import { Investment } from './investment';
import { RewardDto } from './reward-dto';

export class CampaignDto {
  constructor(
    public companyName: string = '',
    public title: string = 'Title',
    public description: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget sapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum mauris.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget sapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurisLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget sapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurisLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget sapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donecmaurissapien non felis varius scelerisque. Donec vitae bibendum maurisLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget sapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donecmaurissapien non felis varius scelerisque. Donec vitae bibendum maurisLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget sapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurisLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget sapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum maurissapien non felis varius scelerisque. Donec vitae bibendum mauris',
    public youtubeLink: string = 'https://www.youtube.com/embed/pTEWnr8VnHY?autoplay=1&start=0',
    public state: string = '',
    public dateCreated: string = '',
    public dateEnded: string = '',
    public investments: Investment[] = [],
    public minimumInvestment: number = 0,
    public goal: number = 0,
    public duration: number = 0,
    public category: string = '',
    public holderName: string = '',
    public bankIndentifier: string = '',
    public accountNumber: string = '',
    public createdByUser: string = '',
    public rewards: RewardDto[] = []
  ) {}
}
