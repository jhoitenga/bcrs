/*
 * Title: sign-in.component.ts
 * Author: Professor Krasso
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/18/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Previous repositories from my personal GitHub: https://github.com/jhoitenga?tab=repositories
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SignInService } from 'src/app/sign-in.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  // Initialize the sign-in form as a FormGroup.
  signInForm: FormGroup = new FormGroup({});
  errorMessage: string = ''; // Initialize an error message variable.

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private signInService: SignInService,
    private snackBar: MatSnackBar
  ) {}

  // Function to display a snackbar.
  showSnackBar(
    message: string,
    action: string,
    duration: number,
    dynamicContent: string = '',
    contentEnd: string = ''
  ) {
    const finalMessage = `${message}${dynamicContent}${contentEnd}`; // Concatenate the message with the dynamic content
    this.snackBar.open(finalMessage, action, {
      duration: duration,
      verticalPosition: 'top', // To display snackbar at the top of the screen
      panelClass: 'app-notification-success',
    });
  }

  ngOnInit(): void {
    // Initialize the sign-in form with validation rules
    this.signInForm = this.fb.group({
      email: [
        '', // Initial empty value
        [
          Validators.required, // Field is required
          Validators.email, // Input must be a valid email address
        ],
      ],
      password: [
        '',
        Validators.compose([
          Validators.required, // Field is required
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[A-Z])[A-Za-z\\d]{8,}$' // Password requires 1 uppercase letter and 1 number with a minimum length of 8 characters.
          ),
        ]),
      ],
    });
  }

  // Function to access form controls.
  get form() {
    return this.signInForm.controls;
  }

  onSubmit() {
    const email = this.signInForm.controls['email'].value;
    const password = this.signInForm.controls['password'].value;
    console.log('Signing in with', email, password);

    // Call the sign in function from the sign-in service.
    this.signInService.signIn(email, password).subscribe({
      next: (res) => {
        this.showSnackBar('Welcome to BCRS, ', '', 5000, res.firstName, '!');
        this.cookieService.set(
          'fullName',
          `${res.firstName} ${res.lastName}`,
          1
        );
        this.cookieService.set('sessionEmail', res.email, 1);
        this.cookieService.set('sessionRole', res.role.text, 1);
        this.router.navigate(['/service']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        console.log(err);
      },
    });
  }
}
