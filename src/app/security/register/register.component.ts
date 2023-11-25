import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;
  form: FormGroup = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[A-Z])[A-Za-z\\d]{8,}$'
        ),
      ]),
    ],
    confirmPassword: [null, Validators.compose([Validators.required])],
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    address: [null, Validators.compose([Validators.required])],
    securityQuestion1: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion1: [
      null,
      Validators.compose([Validators.required]),
    ],
    securityQuestion2: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion2: [
      null,
      Validators.compose([Validators.required]),
    ],
    securityQuestion3: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion3: [
      null,
      Validators.compose([Validators.required]),
    ],
  });

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {}

  // Handle Next Step button click
  goToNextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  // Handle Previous Step button click
  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Progress bar indicator
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        // Validate fields for Step 1
        return (
          this.form.controls['firstName'].valid &&
          this.form.controls['lastName'].valid &&
          this.form.controls['phoneNumber'].valid &&
          this.form.controls['address'].valid
        );

      case 2:
        // Validate fields for Step 2
        return (
          this.form.controls['email'].valid &&
          this.form.controls['password'].valid &&
          this.form.controls['confirmPassword'].valid
        );

      case 3:
        // Validate fields for Step 3
        return (
          this.form.controls['securityQuestion1'].valid &&
          this.form.controls['securityQuestion2'].valid &&
          this.form.controls['securityQuestion3'].valid
        );

      default:
        return false;
    }
  }
}
