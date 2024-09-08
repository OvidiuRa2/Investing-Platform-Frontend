import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  user!: User;
  isAuthenticated: boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem('userdetails') !== null) {
      this.user = JSON.parse(localStorage.getItem('userdetails')!);
      if (this.user.authStatus === 'AUTH') {
        this.isAuthenticated = true;
      }
    }
  }
}
