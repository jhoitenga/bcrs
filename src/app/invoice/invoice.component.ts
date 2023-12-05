/*
 * Title: invoice.component.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 12/05/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 * RxJs Behavior Subject: https://dev.to/dipteekhd/angular-behaviorsubject-p1
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceDataService } from '../services/invoice-data.service';
import dayjs from 'dayjs';

interface InvoiceDetails {
  userId: string;
  orderDate: string;
  customerFullName: string;
  customerEmail: string;
  lineItems: LineItem[];
  partsAmount: number;
  laborAmount: number;
  lineItemTotal: number;
  invoiceTotal: number;
}

interface LineItem {
  name: string;
  price: number;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit, OnDestroy {
  invoiceDetails?: InvoiceDetails; // Stores the invoice details if available.
  private subscription!: Subscription; // Subscription to handle data updates.

  constructor(private invoiceDataService: InvoiceDataService) {}

  ngOnInit(): void {
    // Subscribe to invoice data updates from the service.
    this.subscription = this.invoiceDataService
      .getInvoiceData()
      .subscribe((data) => {
        this.invoiceDetails = data;

        // Update the invoice details when new data is received.

        // Format the order date using dayjs.
        if (this.invoiceDetails && this.invoiceDetails.orderDate) {
          this.invoiceDetails.orderDate = dayjs(
            this.invoiceDetails.orderDate
          ).format('M-D-YYYY');
        }
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the data subscription.
    this.subscription.unsubscribe();
  }

  printInvoice(): void {
    // Trigger the browser's print functionality to print the invoice.
    window.print();
  }
}
