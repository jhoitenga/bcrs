/*
 * Title: register.component.css
 * Author: Professor Krasso
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 11/25/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
