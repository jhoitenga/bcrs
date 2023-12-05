/*
 * Title: invoice.component.spec.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 12/05/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 * RxJs Behavior Subject: https://dev.to/dipteekhd/angular-behaviorsubject-p1
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceComponent } from './invoice.component';

describe('InvoiceComponent', () => {
  let component: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceComponent],
    });
    fixture = TestBed.createComponent(InvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
