import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailRequest } from 'src/app/common/email-request';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactFormGroup!: FormGroup;
  validationMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.contactFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactFormGroup.get('email')?.errors?.['pattern']) {
      this.validationMessage = 'Email must have a valid format';
    } else if (this.contactFormGroup.invalid) {
      this.validationMessage = 'All fields are required';
    } else {
      this.validationMessage = '';
      let data = this.contactFormGroup.value;

      let emailRequest = new EmailRequest(data.name, data.email, data.message);

      this.emailService.sendEmail(emailRequest).subscribe(
        (response) => {
          this.resetFieldsContact();
        },
        (error) => {
          console.error('Error sending email', error);
        }
      );
    }
  }

  resetFieldsContact() {
    this.contactFormGroup.reset({
      name: '',
      email: '',
      message: '',
    });
  }
}
