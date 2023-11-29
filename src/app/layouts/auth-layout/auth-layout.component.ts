/*
 * Title: auth-layout.component.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/28/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css'],
})
export class AuthLayoutComponent {
  // Initialize a variable to control the visibility of the navigation bar
  showNavbar = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Subscribe to router events to determine when navigation ends
    this.router.events
      .pipe(
        // Filter the events to only include NavigationEnd events
        filter((event) => event instanceof NavigationEnd),
        // Map the event to the current activated route
        map(() => this.activatedRoute),
        // Traverse the route tree to get the data of the deepest child route
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        // MergeMap to access the data property of the route
        mergeMap((route) => route.data)
      )
      // Subscribe to the merged data stream to update showNavbar based on 'hideNavbar' data property
      .subscribe((data) => (this.showNavbar = !data['hideNavbar']));
  }
}
