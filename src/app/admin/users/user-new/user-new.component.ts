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
import { Message } from 'primeng/api';

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
  });

  // Initialize user, userId, and errorMessages variables
  user: User;
  userId: string;
  errorMessages: Message[] = [];
  isDisabled: boolean = false; // defaulting to enabled user
  standardRole: Role = { text: 'standard' }; // defaulting to standard role

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
      isDisabled: this.isDisabled,
      role: this.standardRole,
    };

    this.userService.createUser(newUser).subscribe({
      next: (res) => {
        // Navigate back to user-new route upon successful user creation
        this.router.navigate(['/user-new']);
      },
      error: (err) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: err.message },
        ];
        console.log(
          `Node.js server error; httpCode:${err.httpCode};message:${err.message}`
        );
        console.log(err);
      },
    });
  }

  // Function to cancel the user creation and navigate back to the admin page
  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
