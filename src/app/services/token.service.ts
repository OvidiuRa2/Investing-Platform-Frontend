import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenUrl = `http://localhost:8090/api/token`;

  constructor(private http: HttpClient) {}

  validateToken(token: any) {
    return this.http.get<any>(this.tokenUrl + `/validate?token=${token}`, {
      observe: 'response',
    });
  }
}
