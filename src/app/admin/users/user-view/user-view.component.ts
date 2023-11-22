/*
 * Title: user-view.component.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/20/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/role.service';
import { User } from '../../../models/user.interface';
import { Role } from '../../../models/role.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css'],
})
export class UserViewComponent implements OnInit {
  user: User;
  userId: string;
  roles: Role[];
  errorMessages: Message[] = [];

  form: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    address: [null, Validators.compose([Validators.required])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    role: [null, Validators.compose([Validators.required])],
    isDisabled: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService
  ) {
    // Get the userId from route parameters
    this.userId = this.route.snapshot.paramMap.get('userId') ?? '';
    this.user = {} as User;
    this.errorMessages = [];
    this.roles = [];

    // Fetch user data by user ID from the userService
    this.userService.findUserById(this.userId).subscribe({
      next: (user: any) => {
        console.log('Initial User Data:', user);
        // Assign the user data received from the service to the component's user property
        this.user = user;
        console.log(this.user);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        // Set form field values based on user data after fetching is complete
        this.form.controls['firstName'].setValue(this.user.firstName);
        this.form.controls['lastName'].setValue(this.user.lastName);
        this.form.controls['phoneNumber'].setValue(this.user.phoneNumber);
        this.form.controls['address'].setValue(this.user.address);
        this.form.controls['email'].setValue(this.user.email);
        this.form.controls['role'].setValue(this.user.role?.text);
        this.form.controls['isDisabled'].setValue(this.user.isDisabled);
      },
    });
  }

  ngOnInit(): void {}

  saveUser(): void {
    // Create an updatedUser object with values from the form fields
    console.log('Form Values Before Submit:', this.form.value);
    const updatedUser = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      address: this.form.controls['address'].value,
      email: this.form.controls['email'].value,
      isDisabled: this.form.controls['isDisabled'].value === 'true',
      role: { text: this.form.controls['role'].value },
    };
    console.log('Updated User:', updatedUser);

    // Update the user data using the userService
    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (res) => {
        console.log('Update Success Response:', res);
        // Redirect to the user-list page after a successful update
        this.router.navigate(['/user-list']);
      },
      error: (err) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: err.message },
        ];
        console.log(
          `Node.js server error; httpCode: ${err.httpCode}; message:${err.message}`
        );
        console.log(err);
      },
    });
  }

  // Method to cancel and navigate back to the user-list page
  cancel(): void {
    this.router.navigate(['/user-list']);
  }
}
