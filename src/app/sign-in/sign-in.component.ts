import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../session.service';
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
    private sessionService: SessionService,
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
    const username = this.signInForm.controls['username'].value;
    const password = this.signInForm.controls['password'].value;

    // Call the sign in function from the session service.
  }
}
