/*
 * Title: invoice-data.service.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 12/05/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 * RxJs Behavior Subject: https://dev.to/dipteekhd/angular-behaviorsubject-p1
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDataService {
  // Private BehaviorSubject to hold and manage the invoice data.
  private invoiceData = new BehaviorSubject<any>(null);

  constructor() {}

  // Method to set the invoice data within the BehaviorSubject.
  setInvoiceData(data: any): void {
    this.invoiceData.next(data);
  }

  // Method to get the observable of the invoice data.
  getInvoiceData() {
    // Return the observable of the invoice data.
    return this.invoiceData.asObservable();
  }
}
