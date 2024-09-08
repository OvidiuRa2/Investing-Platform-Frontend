export class Reward {
  constructor(
    public name: string = '',
    public price: number = 0,
    public image: File,
    public description: string = '',
  ) {}
}
