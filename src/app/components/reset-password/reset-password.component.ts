import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from 'src/app/common/user-dto';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordFormGroup!: FormGroup;
  errorMessage: string = '';
  emailToResetPassword: string = '';
  token: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
      this.userService.extractUsername(this.token).subscribe((data) => {
        this.emailToResetPassword = data.email;
        console.log(this.emailToResetPassword);
        console.log(this.token);
      });
    });

    this.resetPasswordFormGroup = this.formBuilder.group({
      resetPassword: this.formBuilder.group({
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        repeatedPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
      }),
    });
  }
  onSubmit() {
    if (this.resetPasswordFormGroup.invalid) {
      this.resetPasswordFormGroup.markAllAsTouched();
      return;
    }

    let data = this.resetPasswordFormGroup.controls['resetPassword'].value;
    if (data.newPassword !== data.repeatedPassword) {
      this.errorMessage = 'The passwords do not match';
    } else {
      this.errorMessage = '';
    }

    if (this.errorMessage === '') {
      this.tokenService.validateToken(this.token).subscribe(
        (response) => {
          if (response.status === 200) {
            const user = new UserDto('', '', data.newPassword, '', '');
            this.userService
              .updatePassword(this.emailToResetPassword, user, this.token)
              .subscribe(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Your password has been changed successfully!',
                });
                this.router.navigate(['/login']);
              });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This password reset link has already been used and is no longer valid.',
          });
          this.router.navigate(['/login']);
        }
      );
    }
  }

  get newPassword() {
    return this.resetPasswordFormGroup.get('resetPassword.newPassword');
  }
  get repeatedPassword() {
    return this.resetPasswordFormGroup.get('resetPassword.repeatedPassword');
  }
}
