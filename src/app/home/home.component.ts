/**
 * Title: home.component.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private cookieService: CookieService, private router: Router) {}

  ngOnInit(): void {}

  // Function to check if a user is logged in.
  isLoggedIn(): boolean {
    return !!this.cookieService.get('sessionEmail');
  }
}
