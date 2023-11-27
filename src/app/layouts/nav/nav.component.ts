/**
 * Title: nav.component.ts
 * Author: Professor Krasso
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/16/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

// imports statements
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  cookieValue: string;
  userRole: string;
  // Constructor for the component with injected services.
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cookieValue = this.cookieService.get('fullName');
    this.userRole = this.cookieService.get('sessionRole');
  }

  // Function to display a snackbar.
  showSnackBar(message: string, action: string, duration: number) {
    const finalMessage = `${message}`;
    this.snackBar.open(finalMessage, action, {
      duration: duration,
      verticalPosition: 'top', // To display snackbar at the top of the screen
      panelClass: 'app-notification-success',
    });
  }

  ngOnInit(): void {}

  // Function to check if a user is logged in.
  isLoggedIn(): boolean {
    return !!this.cookieService.get('sessionEmail');
  }

  // Function to check if a user is an admin.
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  // Function to sign out the user.
  signOut() {
    this.showSnackBar('You have been successfully logged out.', '', 5000); // Snackbar to confirm successful logout.
    this.cookieService.deleteAll(); // Delete all cookies.
    this.router.navigate(['/']); // Navigate to the home page.
  }

  // Format role
  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
