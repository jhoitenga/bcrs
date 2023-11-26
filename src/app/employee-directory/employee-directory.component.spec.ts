/*<!--
 * Title: employee-directory.component.spec.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/26/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDirectoryComponent } from './employee-directory.component';

describe('EmployeeDirectoryComponent', () => {
  let component: EmployeeDirectoryComponent;
  let fixture: ComponentFixture<EmployeeDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDirectoryComponent],
    });
    fixture = TestBed.createComponent(EmployeeDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
