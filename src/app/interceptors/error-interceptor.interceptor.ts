import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private loginService: LoginService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          if (localStorage.getItem('signInAttempt') != 'true') {
            localStorage.removeItem('userdetails');
            localStorage.removeItem('jwtToken');

            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Session has expired!',
            });

            this.loginService.logout().subscribe({
              next: (response: any) => {
                this.router.navigate(['/login']);
              },
              error: (err: any) => {
                console.error(`There was an error: ${err.message}`);
              },
            });
          } else {
            localStorage.removeItem('signInAttempt');
          }
        }
        return throwError(() => error);
      })
    );
  }
}
