/**
 * Title: security.service.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/25/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { SelectedSecurityQuestion } from '../models/selected-security-question.interface';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private http: HttpClient) {}

  // Define a private method to handle HTTP errors and return an Observable with an error message.
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMsg =
      error.message || 'Something bad happened; please try again later.';
    console.error('Error from handleError:', errorMsg);
    return throwError(errorMsg);
  }

  signin(email: string, password: string): Observable<any> {
    return this.http.post('/api/security/signin', {
      email,
      password,
    });
  }

  register(user: User): Observable<any> {
    //console.log('Register service called with:', user);
    return this.http.post('/api/security/register', {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      selectedSecurityQuestions: user.selectedSecurityQuestions,
    });
  }

  verifyUser(email: string): Observable<any> {
    return this.http.get(`/api/security/verify/users/${email}`);
  }

  verifySecurityQuestions(
    email: String,
    securityQuestions: SelectedSecurityQuestion[]
  ): Observable<any> {
    const requestBody = {
      questionText1: securityQuestions[0]?.questionText,
      answerText1: securityQuestions[0]?.answerText,
      questionText2: securityQuestions[1]?.questionText,
      answerText2: securityQuestions[1]?.answerText,
      questionText3: securityQuestions[2]?.questionText,
      answerText3: securityQuestions[2]?.answerText,
    };
    return this.http.post(
      `/api/security/verify/users/${email}/security-questions`,
      requestBody
    );
  }

  resetPassword(password: string, email: string): Observable<any> {
    return this.http.post(`/api/security/users/${email}/reset-password`, {
      password,
    });
  }
}
