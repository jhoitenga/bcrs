/*
 * Title: user-list.component.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/22/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.interface';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[];
  errorMessage: string = '';
  successMessage: string = '';

  activeColor: string = 'green';
  inactiveColor: string = 'red';

  userForm: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required])],
  });
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.users = [];

    this.userService.findAllUsers().subscribe({
      next: (users: any) => {
        this.users = users;
        //console.log('User List:', this.users);
      },
      error: (err) => {
        //console.log(err);
        this.errorMessage = 'Failed to load user data. Please try again later.';
      },
      complete: () => {},
    });
  }

  ngOnInit(): void {}

  delete(userId: string) {
    if (
      !confirm(
        'Are you sure you want to deactivate user record ' + userId + '?'
      )
    ) {
      return;
    }
    //console.log('Delete method called with ID:', userId);
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        if (response.status === 204) {
          //console.log('User deleted successfully');
          this.users = this.users.filter((user) => user._id != userId);
          this.successMessage = 'User status has been updated successfully.';
          setTimeout(() => {
            const currentUrl = this.router.url;
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate([currentUrl]);
              });
          }, 3000); // delay for 3 seconds
        }
      },
      error: (err) => {
        //console.log(err);
        this.errorMessage =
          'Failed to delete user data. Please try again later.';
      },
    });
  }
}
