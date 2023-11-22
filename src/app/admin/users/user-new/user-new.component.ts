/**
 * Title: user-new.component.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/20/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.interface';
import { Role } from '../../../models/role.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css'],
})
export class UserNewComponent implements OnInit {
  // Define a FormGroup for the user registration form
  form: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    address: [null, Validators.compose([Validators.required])],
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
    role: [null, Validators.compose([Validators.required])],
    isDisabled: [null, Validators.compose([Validators.required])],
  });

  // Initialize user, userId, and errorMessages variables
  user: User;
  userId: string;
  isDisabled: boolean = false; // defaulting to enabled user
  standardRole: Role = { text: 'standard' }; // defaulting to standard role
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.user = {} as User;
    this.userId = '';
  }

  ngOnInit(): void {}

  // Function to create a new user
  createUser(): void {
    const newUser: User = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      address: this.form.controls['address'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      isDisabled: this.form.controls['isDisabled'].value === 'true',
      role: { text: this.form.controls['role'].value },
    };

    this.userService.createUser(newUser).subscribe({
      next: (res) => {
        // Redirect to the user-list page after a successful update
        this.successMessage =
          'User created successfully. You will now be routed back to the user management page.';
        setTimeout(() => {
          this.router.navigate(['/user-list']);
        }, 3000);
      },
      error: (err) => {
        console.log('Error object:', err);
        console.log(err);

        // Check if the error message contains a duplicate key for email
        if (err.error && err.error.message === 'Email already in use') {
          this.errorMessage =
            'This email address is already in use. Please use a different email address.';
        } else {
          // For other errors, display a generic error message
          this.errorMessage = 'Failed to create user. Please try again.';
        }

        console.log(this.errorMessage);
      },
    });
  }

  // Function to cancel the user creation and navigate back to the admin page
  cancel(): void {
    this.router.navigate(['/user-list']);
  }
}
