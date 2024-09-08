import { RewardQuantity } from './reward-quantity';

export class Investment {
  constructor(
    public date: string = '',
    public amountInvestedStartup: number = 0,
    public amountInvestedPlatform: number = 0,
    public rewardsSelected: RewardQuantity[] = []
  ) {}
}
