/*
 * Title: verify-security-questions.component.ts
 * Author: Professor Krasso
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/29/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SecurityService } from '../../services/security.service';
import { SelectedSecurityQuestion } from 'src/app/models/selected-security-question.interface';
import { VerifySecurityQuestionModel } from 'src/app/models/verify-security-question.interface';

@Component({
  selector: 'app-verify-security-questions',
  templateUrl: './verify-security-questions.component.html',
  styleUrls: ['./verify-security-questions.component.css'],
})
export class VerifySecurityQuestionsComponent {
  errorMessage: string = '';
  successMessage: string = '';
  email: string;
  selectedSecurityQuestions: SelectedSecurityQuestion[];
  verifySecurityQuestionsModel: VerifySecurityQuestionModel;

  // Create the form group with form controls and validators
  form: FormGroup = this.fb.group({
    answerText1: [null, Validators.compose([Validators.required])],
    answerText2: [null, Validators.compose([Validators.required])],
    answerText3: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private securityService: SecurityService
  ) {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    //console.log(this.email);
    this.verifySecurityQuestionsModel = {} as VerifySecurityQuestionModel;

    this.selectedSecurityQuestions = [];
  }

  ngOnInit(): void {
    // Fetch selected security questions for the user
    this.userService.findSelectedSecurityQuestions(this.email).subscribe({
      next: (res) => {
        if (res && res.selectedSecurityQuestions) {
          this.selectedSecurityQuestions = res.selectedSecurityQuestions;
          //console.log('Selected Security Questions',this.selectedSecurityQuestions);

          this.assignQuestionsToModel();
        } else {
          //console.log('No security questions found for user');
          this.errorMessage =
            'No security questions found for user. Please try again later.';
        }
      },
      error: (err) => {
        //console.error('Error in fetching security questions: ', err);
        this.errorMessage =
          'Error in fetching security questions. Please try again later.';
      },
    });
  }

  // Assign security question texts to the model
  assignQuestionsToModel() {
    this.verifySecurityQuestionsModel.questionText1 =
      this.selectedSecurityQuestions[0]?.questionText || '';
    this.verifySecurityQuestionsModel.questionText2 =
      this.selectedSecurityQuestions[1]?.questionText || '';
    this.verifySecurityQuestionsModel.questionText3 =
      this.selectedSecurityQuestions[2]?.questionText || '';
  }

  // Function to verify the security questions and answers
  verifySecurityQuestions() {
    const requestBody = {
      questionText1: this.verifySecurityQuestionsModel.questionText1,
      answerText1: this.form.controls['answerText1'].value,
      questionText2: this.verifySecurityQuestionsModel.questionText2,
      answerText2: this.form.controls['answerText2'].value,
      questionText3: this.verifySecurityQuestionsModel.questionText3,
      answerText3: this.form.controls['answerText3'].value,
    };

    // Verify the answers with the security service
    //console.log('Request body', requestBody);
    // Verify the answers
    this.securityService
      .verifySecurityQuestions(this.email, requestBody)
      .subscribe({
        next: (res) => {
          if (
            res &&
            Array.isArray(res.selectedSecurityQuestions) &&
            res.selectedSecurityQuestions.length > 0
          ) {
            //console.log('Answers verified successfully');
            // Answers verified successfully, navigate to reset password
            this.router.navigate(['/security/reset-password'], {
              queryParams: { isAuthenticated: 'true', email: this.email },
              skipLocationChange: true,
            });
          } else {
            //console.error('Error in verifying security questions');
            this.errorMessage =
              'There was an issue with verifying your answers. Please try again.';
          }
        },
        error: (err) => {
          //console.error(err);
          this.errorMessage =
            'Error in verifying security questions. Please try again later.';
        },
      });
  }
}
