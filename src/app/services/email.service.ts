import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(emailData: any) {
    return this.http.post<any>('http://localhost:8090/send-email', emailData);
  }

  sendEmailResetPassword(emailData: any) {
    return this.http.post<any>(
      'http://localhost:8090/send-email/resetPassword',
      emailData
    );
  }

  sendEmailSuccessfulInvestment(emailData: any) {
    return this.http.post<any>(
      'http://localhost:8090/send-email/successfulInvestment',
      emailData
    );
  }

  sendEmailSuccessfulAccountCreation(emailData: any) {
    return this.http.post<any>(
      'http://localhost:8090/send-email/successfulAccountCreation',
      emailData
    );
  }

    
}
