export class Payment {
  constructor(
    public name: string,
    public currency: string,
    public amount: number,
    public quantity: string,
    public cancelUrl: string,
    public successUrl: string
  ) {}
}
