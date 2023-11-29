/**
 * Title: security.module.ts
 * Author: Professor Krasso
 * Modified by: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './sign-in/sign-in.component';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifySecurityQuestionsComponent } from './verify-security-questions/verify-security-questions.component';

@NgModule({
  declarations: [SecurityComponent, SignInComponent, VerifyEmailComponent, VerifySecurityQuestionsComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
})
export class SecurityModule {}
