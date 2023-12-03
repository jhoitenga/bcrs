/*
 * Title: profile.component.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 12/03/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.interface';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  errorMessage: string = '';
  successMessage: string = '';
  user: User = {} as User;

  isEditMode: boolean = false;
  initialUserPhone: string = '';
  initialUserAddress: string = '';

  // Edit Profile form fields
  profileForm: FormGroup = this.fb.group({
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
  });

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Get the user's session ID from a cookie and load the user's profile
    const userId = this.cookieService.get('sessionUserId');
    this.loadUserProfile(userId);
  }

  // Function to load the user's profile based on the provided userId
  loadUserProfile(userId: string) {
    this.userService.findUserById(userId).subscribe({
      next: (userData: User) => {
        userData.lastSignIn = this.formatDate(userData.lastSignIn);
        this.user = userData;

        // Set the form fields with the fetched user data
        this.profileForm.controls['phoneNumber'].setValue(userData.phoneNumber);
        this.profileForm.controls['address'].setValue(userData.address);
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load employee profile. Please try again later.';
        console.log(err);
      },
    });
  }

  // Function to format a timestamp into a readable date
  formatDate(timestamp?: string) {
    return timestamp
      ? new Date(timestamp).toLocaleString('en-US')
      : 'Not available';
  }

  // Format role
  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Function to toggle the edit mode for the user's profile
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      // Save the initial user phone and address for reference
      this.initialUserPhone = this.user.phoneNumber;
      this.initialUserAddress = this.user.address;
    }
  }

  // Function to save changes to the user's profile
  saveChanges() {
    const userId = this.cookieService.get('sessionUserId');
    if (userId) {
      // Create an updated user info object with changes from the form
      const updatedUserInfo = {
        ...this.user,
        phoneNumber: this.profileForm.value.phoneNumber,
        address: this.profileForm.value.address,
      };

      this.userService.updateUser(userId, updatedUserInfo).subscribe({
        next: () => {
          // Display a success message and refresh the current page after a delay
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            const currentUrl = this.router.url;
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate([currentUrl]);
              });
          }, 3000);

          // Update user object directly from the form values
          this.user.phoneNumber = this.profileForm.value.phoneNumber;
          this.user.address = this.profileForm.value.address;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'An error occurred while updating the profile.';
        },
        complete: () => {
          // Reset the profile form and exit edit mode upon completion
          this.profileForm.reset();
          this.isEditMode = false;
        },
      });
    } else {
      console.error('User ID not found');
      this.errorMessage = 'Unable to update profile. Please try again later.';
    }
  }

  // Function to check if the profile form has been modified
  isFormDirty(): boolean {
    return (
      this.profileForm.controls['phoneNumber'].value !==
        this.initialUserPhone ||
      this.profileForm.controls['address'].value !== this.initialUserAddress
    );
  }
}
