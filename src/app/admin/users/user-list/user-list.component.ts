import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.interface';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[];
  errorMessages: Message[];

  activeColor: string = 'green';
  inactiveColor: string = 'red';

  userForm: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required])],
  });
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
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
    console.log('Delete method called with ID:', userId);
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        if (response.status === 204) {
          console.log('User deleted successfully');
          this.users = this.users.filter((user) => user._id != userId);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
