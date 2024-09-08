import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.css'],
})
export class DropDownMenuComponent implements OnInit {
  user!: User;
  isAuthenticated: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    if (localStorage.getItem('userdetails') !== null) {
      this.user = JSON.parse(localStorage.getItem('userdetails')!);
      if (this.user.authStatus === 'AUTH') {
        this.isAuthenticated = true;
      }
    }
  }

  logout() {
    localStorage.removeItem('userdetails');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('detailedCampaign');

    this.isAuthenticated = false;

    this.loginService.logout().subscribe({
      next: (response: any) => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error(`There was an error: ${err.message}`);
      },
    });
  }
}
