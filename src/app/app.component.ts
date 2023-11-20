/**
 * Title: app.component.ts
 * Author: Professor Krasso
 * Modified by: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 8/5/23
 */

// imports statements
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- This router-outlet displays the content of the BaseLayout or AuthLayout components -->
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {}
