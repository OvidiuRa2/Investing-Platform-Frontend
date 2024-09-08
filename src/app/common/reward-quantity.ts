import { RewardDto } from './reward-dto';

export class RewardQuantity {
  constructor(public quantity: number = 0, public rewardSelected: RewardDto) {}
}
