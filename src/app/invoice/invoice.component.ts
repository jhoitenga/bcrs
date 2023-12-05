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
  invoiceDetails?: InvoiceDetails;
  private subscription!: Subscription;

  constructor(private invoiceDataService: InvoiceDataService) {}

  ngOnInit(): void {
    this.subscription = this.invoiceDataService
      .getInvoiceData()
      .subscribe((data) => {
        this.invoiceDetails = data;

        if (this.invoiceDetails && this.invoiceDetails.orderDate) {
          this.invoiceDetails.orderDate = dayjs(
            this.invoiceDetails.orderDate
          ).format('M-D-YYYY');
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  printInvoice(): void {
    window.print();
  }
}
