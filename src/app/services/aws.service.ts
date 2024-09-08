import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private baseUrl = environment.apiUrl + `/aws`;

  constructor(private httpClient: HttpClient) {}

  uploadImages(files: File[]): Observable<string[]> {
    const headers = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('jwtToken')
      ),
    };
    const formData: FormData = new FormData();
    files.forEach((file) => {
      formData.append(`file`, file, file.name);
    });
    return this.httpClient.post<string[]>(
      `${this.baseUrl}/image`,
      formData,
      headers
    );
  }
}
