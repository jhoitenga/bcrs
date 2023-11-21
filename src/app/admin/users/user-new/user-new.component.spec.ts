/**
 * Title: user-new.component.spec.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/20/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewComponent } from './user-new.component';

describe('UserNewComponent', () => {
  let component: UserNewComponent;
  let fixture: ComponentFixture<UserNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserNewComponent],
    });
    fixture = TestBed.createComponent(UserNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
