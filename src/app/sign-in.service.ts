/*
 * Title: sign-in.service.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/19/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

// Define the SignInService as an injectable service.
@Injectable({
  providedIn: 'root',
})
export class SignInService {
  constructor(private http: HttpClient) {}

  // Define a method for signing in a user.
  signIn(email: string, password: string): Observable<any> {
    // Send a POST request to the '/api/security/signin' endpoint with email and password as data.
    return this.http.post('/api/security/signin', {
      email,
      password,
    });
  }
}
