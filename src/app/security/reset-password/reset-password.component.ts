/*
 * Title: reset-password.component.ts
 * Author: Professor Krasso
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/29/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  errorMessage: string = '';
  successMessage: string = '';
  isAuthenticated: string;
  email: string;

  form: FormGroup = this.fb.group({
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[A-Z])[A-Za-z\\d]{8,}$'
        ),
      ]),
    ],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private securityService: SecurityService
  ) {
    this.isAuthenticated =
      this.route.snapshot.queryParamMap.get('isAuthenticated') ?? ''; // Get authentication status from query parameters
    this.email = this.route.snapshot.queryParamMap.get('email') ?? ''; // Get email address from query parameters
  }

  ngOnInit(): void {}

  // Function to reset the password
  resetPassword() {
    // Get the password from the form
    const password = this.form.controls['password'].value;
    // Call the security service to reset the password
    this.securityService.resetPassword(password, this.email).subscribe({
      next: (res) => {
        // Password reset successful
        this.successMessage =
          'Password reset successfully. You will now be routed to the sign in page.';
        // Redirect to the sign-in page after a delay
        setTimeout(() => {
          this.router.navigate(['/security/sign-in']);
        }, 3000);
      },
      error: (err) => {
        // Password reset failed
        console.log(err);
        this.errorMessage = 'Error resetting password. Please try again.';
      },
    });
  }
}
