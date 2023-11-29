/**
 * Title: security-routing.module.ts
 * Author: Professor Krasso
 * Modified by: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifySecurityQuestionsComponent } from './verify-security-questions/verify-security-questions.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent, // Use AuthLayout for child routes
    children: [
      {
        path: 'sign-in', // Child route for the sign-in page.
        component: SignInComponent,
        data: { hideNavbar: true }, // Hide the navbar for the sign-in page.
        title: 'BCRS: Sign In',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'BCRS: Register',
      },
      {
        path: 'forgot-password',
        component: VerifyEmailComponent,
        title: 'BCRS: Forgot Password',
      },
      {
        path: 'verify-security-questions',
        component: VerifySecurityQuestionsComponent,
        title: 'BCRS: Forgot Password',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'BCRS: Forgot Password',
      },
    ],
  },
  {
    path: '', // The default path for the Security component.
    component: SecurityComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}
