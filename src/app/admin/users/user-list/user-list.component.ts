import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.interface';
import { UserService } from '../../../services/user.service';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class UserListComponent implements OnInit {
  users: User[];
  errorMessages: Message[];

  userForm: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required])],
  });
  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.users = [];
    this.errorMessages = [];

    this.userService.findAllUsers().subscribe({
      next: (users: any) => {
        this.users = users;
        console.log('User List:', this.users);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  ngOnInit(): void {}

  delete(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(userId).subscribe({
          next: (res) => {
            // If the user is the same at the signed in user, log them out, delete cookie, and redirect to the login page
            if (res.data.username === this.cookieService.get('sessionUser')) {
              this.cookieService.delete('sessionUser');
              this.cookieService.delete('sessionRole');
              this.router.navigate(['session/sign-in']);
            } else {
              console.log('User deleted successfully');
              this.users = this.users.filter((user) => user._id != userId);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User deleted successfully',
              });
            }
          },

          error: (err) => {
            console.log(err);
          },
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            console.log('User rejected this operation');
            break;
          case ConfirmEventType.CANCEL:
            console.log('User canceled this operation');
            break;
        }
      },
    });
  }
}
