/**
 * Title: user.interface.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/20/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { Role } from './role.interface';
import { SelectedSecurityQuestion } from './selected-security-question.interface';

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  password?: string;
  isDisabled: boolean;
  role: Role; // From Role interface
  selectedSecurityQuestions?: SelectedSecurityQuestion[]; // From SelectedSecurityQuestion interface
  lastSignIn?: string;
}
