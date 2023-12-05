/*
 * Title: service.component.ts
 * Author: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Date: 12/03/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Bootstrap: https://getbootstrap.com/docs/5.3/getting-started/introduction/
 * DayJs: https://www.freecodecamp.org/news/javascript-date-time-dayjs/
 */

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { InvoiceDataService } from '../services/invoice-data.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
})
export class ServiceComponent {
  errorMessage: string = '';
  successMessage: string = '';
  invoiceForm: FormGroup;
  // List of available services with their prices and selected state
  services: { name: string; price: number; selected: FormControl }[] = [
    { name: 'Password Reset', price: 39.99, selected: new FormControl(false) },
    { name: 'Spyware Removal', price: 99.99, selected: new FormControl(false) },
    { name: 'RAM Upgrade', price: 129.99, selected: new FormControl(false) },
    {
      name: 'Software Installation',
      price: 49.99,
      selected: new FormControl(false),
    },
    { name: 'PC Tune Up', price: 89.99, selected: new FormControl(false) },
    {
      name: 'Keyboard Cleaning',
      price: 45.0,
      selected: new FormControl(false),
    },
    { name: 'Disk Clean Up', price: 129.99, selected: new FormControl(false) },
  ];

  totalPrice: number = 0;
  servicesTotal: number = 0;

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private invoiceService: InvoiceService,
    private router: Router,
    private invoiceDataService: InvoiceDataService
  ) {
    // Initialize the main form group with default values and validators
    this.invoiceForm = this.fb.group({
      orderDate: ['', Validators.required],
      customerFullName: ['', Validators.required],
      customerEmail: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      partsAmount: [0, Validators.required],
      laborAmount: [0, Validators.required],
      lineItemTotal: ['', Validators.required],
      invoiceTotal: ['', Validators.required],
    });
  }

  // Update the total price based on selected services and user inputs
  updateTotal() {
    // Calculate the total price of selected services
    this.servicesTotal = this.services.reduce((total, service) => {
      if (service.selected.value) {
        return total + service.price;
      }
      return total;
    }, 0);

    this.invoiceForm.get('lineItemTotal')?.setValue(this.servicesTotal);
    // Get user input values for parts and labor
    const partsAmount =
      parseFloat(this.invoiceForm.get('partsAmount')?.value) || 0;
    const laborAmount =
      parseFloat(this.invoiceForm.get('laborAmount')?.value) || 0;

    // Calculate the cost of labor
    const laborCost = laborAmount * 50;

    // Calculate the total invoice price
    let totalPrice = this.servicesTotal + partsAmount + laborCost;

    // Adjust total price if any input is NaN (not a number)
    if (isNaN(partsAmount)) {
      totalPrice -= partsAmount;
    }
    if (isNaN(laborAmount)) {
      totalPrice -= laborAmount;
    }

    // Update the invoice form and display total price
    this.invoiceForm.patchValue({ invoiceTotal: totalPrice });
    this.totalPrice = totalPrice;
  }

  // Handle form submission
  onSubmit() {
    console.log('Form Data:', this.invoiceForm.value);
    if (this.invoiceForm.valid) {
      // Prepare form data for submission
      const formData = this.invoiceForm.value;
      formData.orderDate = dayjs(formData.orderDate).format('M-D-YYYY');
      console.log('Formatted Form Data:', formData);

      formData.partsAmount = formData.partsAmount
        ? parseFloat(formData.partsAmount)
        : 0;
      formData.laborAmount = formData.laborAmount
        ? parseFloat(formData.laborAmount)
        : 0;
      console.log('Form Data:', formData);
      // Get user ID from cookies
      const userId = this.cookieService.get('sessionUserId');
      console.log('User ID:', userId);

      // Prepare line items based on selected services
      formData.lineItems = this.services
        .filter((service) => service.selected.value)
        .map((service) => ({ name: service.name, price: service.price }));

      // Call the invoice service to create the invoice
      this.invoiceService.createInvoice(userId, formData).subscribe(
        (res) => {
          console.log('Invoice created successfully:', res);
          this.invoiceDataService.setInvoiceData(res);
          this.successMessage =
            'Invoice created successfully. You will be routed to the invoice summary page.';
          // Reload the current route to reset the form

          this.router.navigate(['/invoice']);
        },

        (err) => {
          console.error('Error creating invoice:', err);
          this.errorMessage = 'Error creating invoice. Please try again later.';
        }
      );
    }
  }
}
