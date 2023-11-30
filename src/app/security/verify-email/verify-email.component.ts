/*
 * Title: verify-email.component.ts
 * Author: Professor Krasso
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/29/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent {
  errorMessage: string = '';
  successMessage: string = '';
  currentStep = 1;
  totalSteps = 2;

  // Create the form group with form controls and validators
  form: FormGroup = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.errorMessage = '';
  }

  // Function to verify user based on email
  verifyUser() {
    // Get the email from the form
    const email = this.form.controls['email'].value;
    //console.log(email);
    // Call the security service to verify the user's email
    this.securityService.verifyUser(email).subscribe({
      next: (res: any) => {
        //console.log(res);
        // User email verification successful
        this.router.navigate(['/security/verify-security-questions'], {
          queryParams: { email },
          skipLocationChange: true,
        });
      },
      error: (err: any) => {
        // User email verification failed
        if (err.status === 404)
          this.errorMessage =
            'Email cannot be found. Please try again or contact support.';
        //console.log(err);
        this.errorMessage =
          'Email cannot be found. Please try again or contact support.';
      },
    });
  }
}
