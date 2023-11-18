/*
 * Title: auth.guard.spec.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/17/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Previous repositories from my personal GitHub: https://github.com/jhoitenga?tab=repositories
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
