/*
 * Title: purchases-by-service.component.spec.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 12/3/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * PrimeNG: https://primeng.org/chart
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesByServiceComponent } from './purchases-by-service.component';

describe('PurchasesByServiceComponent', () => {
  let component: PurchasesByServiceComponent;
  let fixture: ComponentFixture<PurchasesByServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchasesByServiceComponent],
    });
    fixture = TestBed.createComponent(PurchasesByServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
