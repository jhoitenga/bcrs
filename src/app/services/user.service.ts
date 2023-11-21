/**
 * Title: user.service.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/20/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Define a private method to handle HTTP errors and return an Observable with an error message.
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMsg =
      error.message || 'Something bad happened; please try again later.';
    console.error('Error from handleError:', errorMsg);
    return throwError(errorMsg);
  }

  // Get all users
  findAllUsers(): Observable<any> {
    return this.http.get('/api/users');
  }

  // Find user by ID
  findUserById(userId: string): Observable<any> {
    console.log('Finding user with ID:', userId);
    return this.http.get(`/api/users/${userId}`);
  }

  // Create user
  createUser(user: User): Observable<any> {
    console.log('Creating user:', user);
    return this.http.post('/api/users', {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
      password: user.password,
      isDisabled: user.isDisabled,
      role: user.role?.text,
    });
  }

  // Update user
  updateUser(userId: string, user: User): Observable<any> {
    console.log(`Updating user with ID ${userId}:`, user);
    return this.http.put(`/api/users/${userId}`, {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
      isDisabled: user.isDisabled,
      role: user.role?.text,
    });
  }

  // Delete user
  deleteUser(userId: string): Observable<any> {
    console.log('Deleting user with ID:', userId);
    return this.http.delete(`/api/users/${userId}`);
  }
}
