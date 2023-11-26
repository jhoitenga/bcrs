/**
 * Title: app.module.ts
 * Author: Professor Krasso
 * Modified by: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { NavComponent } from './layouts/nav/nav.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FaqComponent } from './faq/faq.component';
import { EmployeeDirectoryComponent } from './employee-directory/employee-directory.component';
import { RegisterComponent } from './security/register/register.component';
import { ServiceComponent } from './service-request/service.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { UserNewComponent } from './admin/users/user-new/user-new.component';
import { UserViewComponent } from './admin/users/user-view/user-view.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BaseLayoutComponent,
    NavComponent,
    FooterComponent,
    NotFoundComponent,
    FaqComponent,
    EmployeeDirectoryComponent,
    RegisterComponent,
    ServiceComponent,
    ProfileComponent,
    AdminComponent,
    UserListComponent,
    UserViewComponent,
    UserNewComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    MessageModule,
    MessagesModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
