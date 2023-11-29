import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { User } from '../../models/user.interface';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent {
  errorMessage: string = '';
  successMessage: string = '';
  currentStep = 1;
  totalSteps = 2;

  // Create the form group with form controls and validators
  form: FormGroup = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.errorMessage = '';
  }

  verifyUser() {
    const email = this.form.controls['email'].value;
    //console.log(email);
    this.securityService.verifyUser(email).subscribe({
      next: (res: any) => {
        //console.log(res);

        this.router.navigate(['/security/verify-security-questions'], {
          queryParams: { email },
          skipLocationChange: true,
        });
      },
      error: (err: any) => {
        if (err.status === 404) this.errorMessage = 'Email not found';
        //console.log(err);

        this.errorMessage =
          'Email cannot be found. Please try again or contact support.';
      },
    });
  }
}
