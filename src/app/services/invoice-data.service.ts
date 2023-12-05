import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDataService {
  private invoiceData = new BehaviorSubject<any>(null);

  constructor() {}

  setInvoiceData(data: any): void {
    this.invoiceData.next(data);
  }

  getInvoiceData() {
    return this.invoiceData.asObservable();
  }
}
