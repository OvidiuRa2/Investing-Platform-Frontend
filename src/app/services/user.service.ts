import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../common/user';
import { Observable } from 'rxjs';
import { Campaign } from '../common/campaign';
import { CampaignDto } from '../common/campaign-dto';
import { UserDto } from '../common/user-dto';
import { UsernameClaim } from '../common/username-claim';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = `http://localhost:8090/api/user`;
  headers = {
    headers: new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('jwtToken')
    ),
  };
  constructor(private httpClient: HttpClient) {}

  saveUser(user: User): Observable<any> {
    this.headers = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('jwtToken')
      ),
    };

    return this.httpClient.post<User>(`${this.userUrl}`, user, this.headers);
  }

  findUser(email: string): Observable<any> {
    return this.httpClient.get<User>(
      `${this.userUrl}/findByEmail?email=${email}`
    );
  }

  updateUser(email: string, user: UserDto): Observable<any> {
    const updateUrl = this.userUrl + `/${email}`;
    return this.httpClient.put<User>(updateUrl, user);
  }

  findUserByInvestmentId(investmentId: string): Observable<any> {
    const findUserByInvestmentIdUrl = this.userUrl + `/find/${investmentId}`;
    return this.httpClient.get<User>(findUserByInvestmentIdUrl);
  }

  updatePassword(
    email: string,
    user: UserDto,
    token: string | null
  ): Observable<any> {
    const headersResetPassword = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
    };
    const updatePasswordUrl = this.userUrl + `/reset-password?email=${email}`;
    return this.httpClient.put(updatePasswordUrl, user, headersResetPassword);
  }

  extractUsername(token: string | null): Observable<any> {
    const extractUsernameUrl =
      this.userUrl + `/extract-username?token=${token}`;
    return this.httpClient.get<UsernameClaim>(extractUsernameUrl);
  }
}
