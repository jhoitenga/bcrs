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
import { User } from '../models/user.interface';
import { VerifySecurityQuestionModel } from '../models/verify-security-question.interface';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private http: HttpClient) {}

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
    return this.http.post(`/api/security/verify/users/${email}`, {});
  }

  verifySecurityQuestions(
    email: string,
    request: VerifySecurityQuestionModel
  ): Observable<any> {
    return this.http.post(
      `/api/security/verify/users/${email}/security-questions`,
      request
    );
  }

  resetPassword(password: string, email: string): Observable<any> {
    return this.http.post(`/api/security/users/${email}/reset-password`, {
      password,
    });
  }
}
