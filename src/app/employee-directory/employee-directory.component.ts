/*<!--
 * Title: employee-directory.component.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/26/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.interface';

@Component({
  selector: 'app-employee-directory',
  templateUrl: './employee-directory.component.html',
  styleUrls: ['./employee-directory.component.css'],
})
export class EmployeeDirectoryComponent {
  errorMessage: string = '';
  successMessage: string = '';
  users: any[] = [];
  isImageLoaded = false;

  constructor(private userService: UserService) {
    this.users = [];
    this.errorMessage = '';

    // Find all users
    this.userService.findAllUsers().subscribe({
      next: (users: User[]) => {
        // Filtering out disabled users
        this.users = users.filter((user: User) => !user.isDisabled);
      },
      error: (err) => {
        // If error, display error message
        this.errorMessage =
          'Failed to load employee directory. Please try again later.';
        //console.log(err);
      },
    });
  }

  // Format role
  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Changing isImageLoaded is true for spinner
  onImageLoad() {
    this.isImageLoaded = true;
  }

  // To ensure unique image for each employee
  getRandomNumber() {
    return Math.floor(Math.random() * 10);
  }
}
