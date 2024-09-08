import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EmailRequest } from 'src/app/common/email-request';
import { User } from 'src/app/common/user';
import { UserDto } from 'src/app/common/user-dto';
import { EmailService } from 'src/app/services/email.service';
import { LoginService } from 'src/app/services/login.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signUpFormGroup!: FormGroup;
  signInFormGroup!: FormGroup;
  serviceResponse!: User;
  emailAlreadyExists: boolean = false;
  errorMessage: string = '';

  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.signUpFormGroup = this.formBuilder.group({
      signUpUser: this.formBuilder.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/),
        ]),
      }),
    });

    this.signInFormGroup = this.formBuilder.group({
      signInUser: this.formBuilder.group({
        signInEmail: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
        signInPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
      }),
    });
  }

  onSignUp() {
    if (this.signUpFormGroup.invalid) {
      this.signUpFormGroup.markAllAsTouched();
      return;
    }
    let data = this.signUpFormGroup.controls['signUpUser'].value;

    let user = new UserDto(
      data.name,
      data.email,
      data.password,
      data.phoneNumber,
      ''
    );
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    signInButton.click();
    this.loginService.signUp(user).subscribe({
      next: (response: any) => {
        if (response === null) {
          this.emailAlreadyExists = true;
        }
        this.resetFieldsSignUp();
        let emailRequest = new EmailRequest(user.name, user.email, '');
        this.emailService
          .sendEmailSuccessfulAccountCreation(emailRequest)
          .subscribe({ next: (response: any) => {} });
      },
      error: (err: any) => {
        console.error(`There was an error: ${err.message}`);
      },
    });
  }

  onSignIn() {
    if (this.signInFormGroup.invalid) {
      this.signInFormGroup.markAllAsTouched();
      return;
    }
    localStorage.setItem('signInAttempt', 'true');

    let data = this.signInFormGroup.controls['signInUser'].value;

    let user = new UserDto('', data.signInEmail, data.signInPassword, '', '');

    this.loginService.login(user).subscribe({
      next: (response: any) => {
        this.errorMessage = '';
        console.log(response);

        this.resetFieldsSignIn();
        const authToken = response.body.token;

        this.serviceResponse = new User(
          response.body.name,
          response.body.email,
          response.body.password,
          response.body.phoneNumber
        );
        this.serviceResponse.campaigns = response.body.campaigns;
        this.serviceResponse.investments = response.body.investments;
        this.serviceResponse.authStatus = 'AUTH';
        this.serviceResponse.role = response.body.role;
        this.serviceResponse.imageUrl = response.body.imageUrl;
        if (authToken) {
          localStorage.setItem('jwtToken', authToken);
          localStorage.setItem(
            'userdetails',
            JSON.stringify(this.serviceResponse)
          );
        }
        localStorage.removeItem('signInAttempt');

        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.errorMessage = 'Invalid email or password';
        console.log(this.errorMessage);
      },
    });
  }

  resetFieldsSignUp() {
    this.signUpFormGroup.reset({
      signUpUser: {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
      },
    });
  }

  resetFieldsSignIn() {
    this.signInFormGroup.reset({
      signInUser: {
        signInEmail: '',
        signInPassword: '',
      },
    });
  }

  changePanel(direction: string) {
    const container = this.elementRef.nativeElement.querySelector('#container');
    if (container) {
      if (direction === 'signUp') {
        container.classList.add('right-panel-active');
      } else {
        container.classList.remove('right-panel-active');
      }
    }
  }

  get name() {
    return this.signUpFormGroup.get('signUpUser.name');
  }
  get email() {
    return this.signUpFormGroup.get('signUpUser.email');
  }
  get password() {
    return this.signUpFormGroup.get('signUpUser.password');
  }
  get phoneNumber() {
    return this.signUpFormGroup.get('signUpUser.phoneNumber');
  }
  get signInEmail() {
    return this.signInFormGroup.get('signInUser.signInEmail');
  }
  get signInPassword() {
    return this.signInFormGroup.get('signInUser.signInPassword');
  }

  async resetPassword() {
    const { value: email } = await Swal.fire({
      title: 'Forgot your password?',
      input: 'email',
      inputPlaceholder: 'Enter your email address',
    });
    if (email) {
      let emailRequest = new EmailRequest('', email, '');
      Swal.fire({
        icon: 'info',
        title: 'Please check your email address',
        text: 'We have sent you a password reset email',
      });
      this.emailService.sendEmailResetPassword(emailRequest).subscribe(
        (response) => {},
        (error) => {
          console.error('Error sending email', error);
        }
      );
    }
  }
}
