export class PaymentInfo {
  constructor(
    public amount: number = 0,
    public currency: string = '',
    public receiptEmail: string = ''
  ) {}
}
