/*
 * Title: sign-in.service.spec.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/19/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { TestBed } from '@angular/core/testing';

import { SessionService } from './sign-in.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
