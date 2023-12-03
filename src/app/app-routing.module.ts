/**
 * Title: app-routing.module.ts
 * Modified by: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EmployeeDirectoryComponent } from './employee-directory/employee-directory.component';
import { AuthGuard } from './auth.guard';
import { ServiceComponent } from './service-request/service.component';
import { RoleGuard } from './role.guard';
import { ProfileComponent } from './profile/profile.component';
import { UserNewComponent } from './admin/users/user-new/user-new.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { UserViewComponent } from './admin/users/user-view/user-view.component';
import { PurchasesByServiceComponent } from './admin/purchases-by-service/purchases-by-service.component';

// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'BCRS: Home', // title for the home page
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'BCRS: Home',
      },
      {
        path: 'faq',
        component: FaqComponent,
        title: 'BCRS: FAQ',
      },
      {
        path: 'employee-directory',
        component: EmployeeDirectoryComponent,
        title: 'BCRS: Employee Directory',
        canActivate: [AuthGuard],
      },
      {
        path: 'service',
        component: ServiceComponent,
        title: 'BCRS: Service',
        canActivate: [AuthGuard],
      },

      {
        path: 'profile',
        component: ProfileComponent,
        title: 'BCRS: Profile',
        canActivate: [AuthGuard],
      },
      {
        path: 'user-new',
        component: UserNewComponent,
        title: 'BCRS: New User',
        canActivate: [RoleGuard],
      },
      {
        path: 'user-view/:userId',
        component: UserViewComponent,
        title: 'BCRS: User Update',
        canActivate: [RoleGuard],
      },
      {
        path: 'user-list',
        component: UserListComponent,
        title: 'BCRS: User Configuration',
        canActivate: [RoleGuard],
      },
      {
        path: 'purchase-graph',
        component: PurchasesByServiceComponent,
        title: 'BCRS: Purchases By Service',
        canActivate: [RoleGuard],
      },
      {
        path: 'not-found',
        component: NotFoundComponent, // Route for displaying "Not Found" page.
        title: 'BCRS: Not Found',
      },
    ],
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () =>
      import('./security/security.module').then((m) => m.SecurityModule),
  },
  {
    path: '**', // This will catch all other routes.
    redirectTo: 'not-found', // Redirect to the 'not-found' route in the session layout.
  },
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
