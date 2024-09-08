import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../common/user';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthenticationResponse } from '../common/authentication-response';
import { UserDto } from '../common/user-dto';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private signUpUrl = `http://localhost:8090/api/user/register`;
  private signInUrl = `http://localhost:8090/api/user/login`;
  private logoutUrl = `http://localhost:8090/logout`;
  constructor(private httpClient: HttpClient) {}

  signUp(user: UserDto): Observable<any> {
    return this.httpClient.post<AuthenticationResponse>(this.signUpUrl, user);
  }

  login(user: UserDto): Observable<HttpResponse<any>> {
    return this.httpClient.post<AuthenticationResponse>(this.signInUrl, user, {
      observe: 'response',
    });
  }

  logout(): Observable<any> {
    return this.httpClient.post<any>(this.logoutUrl, '');
  }
}
