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
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifySecurityQuestionsComponent } from './verify-security-questions/verify-security-questions.component';

const routes: Routes = [
  {
    path: '', // The default path for the Security component.
    component: SecurityComponent,
    children: [
      {
        path: 'sign-in', // Child route for the sign-in page.
        component: SignInComponent,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}
