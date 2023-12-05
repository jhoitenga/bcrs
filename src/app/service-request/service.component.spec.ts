/*
 * Title: service.component.spec.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 12/03/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 * DayJs: https://www.freecodecamp.org/news/javascript-date-time-dayjs/
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceComponent } from './service.component';

describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceComponent],
    });
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
