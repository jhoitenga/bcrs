/*
 * Title: auth.guard.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/17/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Previous repositories from my personal GitHub: https://github.com/jhoitenga?tab=repositories
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

// Define the Auth Guard as an injectable service.
@Injectable({
  providedIn: 'root', // Specify that this guard is provided at the root level.
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}
  // Guard that checks whether a session user is authenticated.
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const sessionUser = this.cookieService.get('sessionUser');

    if (sessionUser) {
      // User is authenticated; allow access to the route.
      return true;
    } else {
      // User is not authenticated; navigate to the sign-in page and deny access.
      this.router.navigate(['/security/sign-in']); // Redirect to the sign-in page.
      return false; // Deny access to the route.
    }
  }
}
