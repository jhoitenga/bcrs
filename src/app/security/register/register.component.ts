/*
 * Title: register.component.ts
 * Author: Professor Krasso
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/25/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/user.interface';
import { SecurityService } from '../../services/security.service';

// Custom validator function to check if password and confirmPassword match
function passwordMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('password');
  const confirmPassword = formGroup.get('confirmPassword');

  // Check if both controls are present
  if (password && confirmPassword) {
    if (password.value !== confirmPassword.value) {
      // Set mismatch error on confirmPassword control
      confirmPassword.setErrors({ mismatch: true });
    } else {
      // Clear any existing mismatch error
      confirmPassword.setErrors(null);
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;
  securityQuestions: string[];
  user: User;

  // Create the form group with form controls and validators
  form: FormGroup = this.fb.group(
    {
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[A-Z])[A-Za-z\\d]{8,}$'
          ),
        ]),
      ],
      confirmPassword: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      phoneNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^\+?\d{0,2}(\s?|[\.-]?)\(?(\d{3})\)?(\s?|[\.-]?)\d{3}(\s?|[\.-]?)\d{4}$/
          ),
        ]),
      ],
      address: [null, Validators.compose([Validators.required])],
      securityQuestion1: ['', Validators.compose([Validators.required])],
      securityAnswer1: [null, Validators.compose([Validators.required])],
      securityQuestion2: ['', Validators.compose([Validators.required])],
      securityAnswer2: [null, Validators.compose([Validators.required])],
      securityQuestion3: ['', Validators.compose([Validators.required])],
      securityAnswer3: [null, Validators.compose([Validators.required])],
    },
    { validators: passwordMatchValidator } // Apply the custom passwordMatchValidator
  );

  errorMessage: string = '';
  successMessage: string = '';

  filteredSecurityQuestions1: string[] = [];
  filteredSecurityQuestions2: string[] = [];
  filteredSecurityQuestions3: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    // Predefined security questions
    this.securityQuestions = [
      "What was your first pet's name?",
      'What was the model of your first car?',
      'What was the name of your first school?',
      'What was the first concert you attended?',
      'What was the name of your first boss?',
      'What is the name of your favorite sports team?',
      'What is the name of your favorite movie?',
      'What is the name of your favorite musician?',
      'What is the name of your favorite artist?',
    ];

    // Initialize the user object
    this.user = {} as User;
  }

  ngOnInit(): void {
    // Initialize the filtered security questions
    this.filteredSecurityQuestions1 = [...this.securityQuestions];
    this.filteredSecurityQuestions2 = [...this.securityQuestions];
    this.filteredSecurityQuestions3 = [...this.securityQuestions];
    // Subscribe to changes in securityQuestion1
    this.form.get('securityQuestion1')?.valueChanges.subscribe((value) => {
      this.updateFilteredQuestions(value, 'securityQuestion1');
    });

    // Subscribe to changes in securityQuestion2
    this.form.get('securityQuestion2')?.valueChanges.subscribe((value) => {
      this.updateFilteredQuestions(value, 'securityQuestion2');
    });

    // Subscribe to changes in securityQuestion3
    this.form.get('securityQuestion3')?.valueChanges.subscribe((value) => {
      this.updateFilteredQuestions(value, 'securityQuestion3');
    });
  }

  // Update the filtered security questions based on user selections
  updateFilteredQuestions(selectedValue: string, controlName: string): void {
    // Create new arrays for the filtered questions to trigger change detection
    let questions1 = [...this.securityQuestions];
    let questions2 = [...this.securityQuestions];
    let questions3 = [...this.securityQuestions];

    // Remove the selected values from the other lists
    if (
      controlName !== 'securityQuestion1' &&
      this.form.value.securityQuestion1
    ) {
      questions2 = questions2.filter(
        (q) => q !== this.form.value.securityQuestion1
      );
      questions3 = questions3.filter(
        (q) => q !== this.form.value.securityQuestion1
      );
    }
    if (
      controlName !== 'securityQuestion2' &&
      this.form.value.securityQuestion2
    ) {
      questions1 = questions1.filter(
        (q) => q !== this.form.value.securityQuestion2
      );
      questions3 = questions3.filter(
        (q) => q !== this.form.value.securityQuestion2
      );
    }
    if (
      controlName !== 'securityQuestion3' &&
      this.form.value.securityQuestion3
    ) {
      questions1 = questions1.filter(
        (q) => q !== this.form.value.securityQuestion3
      );
      questions2 = questions2.filter(
        (q) => q !== this.form.value.securityQuestion3
      );
    }

    // Update the filtered questions
    this.filteredSecurityQuestions1 = questions1;
    this.filteredSecurityQuestions2 = questions2;
    this.filteredSecurityQuestions3 = questions3;
  }

  // Get filtered questions excluding those in the excludeQuestions array
  getFilteredQuestions(excludeQuestions: string[]): string[] {
    return this.securityQuestions.filter((q) => !excludeQuestions.includes(q));
  }

  // Handle Next Step button click
  goToNextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  // Handle Previous Step button click
  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Progress bar indicator
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        // Validate fields for Step 1
        return (
          this.form.controls['firstName'].valid &&
          this.form.controls['lastName'].valid &&
          this.form.controls['phoneNumber'].valid &&
          this.form.controls['address'].valid
        );

      case 2:
        // Validate fields for Step 2
        return (
          this.form.controls['email'].valid &&
          this.form.controls['password'].valid &&
          this.form.controls['confirmPassword'].valid
        );

      case 3:
        // Validate fields for Step 3
        return (
          this.form.controls['securityQuestion1'].valid &&
          this.form.controls['securityQuestion2'].valid &&
          this.form.controls['securityQuestion3'].valid
        );

      default:
        return false;
    }
  }

  // Handle form submission
  onSubmit(): void {
    const form = this.form.value;
    //console.log(form);
    // Create the user object with form values and defaults
    this.user = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      address: form.address,
      email: form.email,
      password: form.password,
      isDisabled: false, // default to false
      role: {
        text: 'Standard', // default to standard
      },
      selectedSecurityQuestions: [
        {
          questionText: form.securityQuestion1,
          answerText: form.securityAnswer1,
        },
        {
          questionText: form.securityQuestion2,
          answerText: form.securityAnswer2,
        },
        {
          questionText: form.securityQuestion3,
          answerText: form.securityAnswer3,
        },
      ],
    };
    //console.log('User Object:', this.user);

    // Call the security service to register the user
    //console.log('Calling register service with user:', this.user);
    this.securityService.register(this.user).subscribe({
      next: (res) => {
        //console.log('Registration successful:', res);
        // Navigate to the sign-in page upon successful registration
        this.successMessage =
          'Account created successfully. You will now be routed to the sign in page.';
        setTimeout(() => {
          this.router.navigate(['/security/sign-in']);
        }, 3000);
      },
      error: (err) => {
        // Handle and display any registration errors
        this.errorMessage = err.message;
        console.log(`Node.js server error: ${err.message}`);
        console.log(err);
      },
    });
  }
}
