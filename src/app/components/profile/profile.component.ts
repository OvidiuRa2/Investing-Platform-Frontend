import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { UserDto } from 'src/app/common/user-dto';
import { AwsService } from 'src/app/services/aws.service';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user!: User;
  isAuthenticated: boolean = false;
  updateProfileFormGroup!: FormGroup;
  errorMessage: string = '';
  uploadImages: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private awsService: AwsService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('userdetails') !== null) {
      this.user = JSON.parse(localStorage.getItem('userdetails')!);
      if (this.user.authStatus === 'AUTH') {
        this.isAuthenticated = true;
      }
    }

    this.updateProfileFormGroup = this.formBuilder.group({
      email: [this.user.email],
      name: [this.user.name],
      phoneNumber: [this.user.phoneNumber],
      newPassword: [''],
      repeatedPassword: [''],
      image: [null],
    });
  }

  onSubmit() {
    let data = this.updateProfileFormGroup.value;

    let userDto = new UserDto('', '', '', '', '');

    if (data.name !== this.user.name) {
      userDto.name = data.name;
    }

    if (data.email !== this.user.email) {
      userDto.email = data.email;
    }

    if (data.phoneNumber !== this.user.phoneNumber) {
      userDto.phoneNumber = data.phoneNumber;
    }

    if (data.newPassword != '') {
      if (data.newPassword === data.repeatedPassword) {
        this.errorMessage = '';
        userDto.password = data.newPassword;
      } else {
        this.errorMessage = 'Passwords do not match';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    if (data.image != null && this.errorMessage === '') {
      this.uploadImages.push(data.image);
      this.awsService.uploadImages(this.uploadImages).subscribe((response) => {
        console.log('Files uploaded successfully:', response);
        userDto.imageUrl = response[0];

        this.userService.updateUser(this.user.email, userDto).subscribe({
          next: (response: any) => {
            this.logout();
          },
          error: (err: any) => {
            console.error(`There was an error: ${err.message}`);
          },
        });
      });
    } else if (this.errorMessage === '') {
      this.userService.updateUser(this.user.email, userDto).subscribe({
        next: (response: any) => {
          this.logout();
        },
        error: (err: any) => {
          console.error(`There was an error: ${err.message}`);
        },
      });
    }
  }

  onFileChange(event: any) {
    const imageControl = this.updateProfileFormGroup.get('image');

    if (imageControl) {
      if (event.target.files && event.target.files.length) {
        const file = event.target.files[0];

        if (file.size > 1024 * 1024) {
          this.errorMessage =
            'The file is too large. Please upload a file of maximum 1MB.';
          event.target.value = null;
          return;
        }
        this.errorMessage = '';

        imageControl.setValue(file);
        this.updateProfileFormGroup.updateValueAndValidity();
      }
    }
  }

  logout() {
    localStorage.removeItem('userdetails');
    localStorage.removeItem('jwtToken');
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
