/*
 * Title: purchases-by-service.component.ts
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 12/3/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * PrimeNG: https://primeng.org/chart
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-purchases-by-service',
  templateUrl: './purchases-by-service.component.html',
  styleUrls: ['./purchases-by-service.component.css'],
})
export class PurchasesByServiceComponent {
  purchases: any;
  data: any;
  itemCount: number[] = [];
  labels: string[] = [];

  constructor(private http: HttpClient) {
    // Get the purchases from the invoices collection
    this.http.get('/api/invoices/purchases-graph').subscribe(
      (res) => {
        // Assign the response to the purchases array
        this.purchases = res;

        // Loop through the purchases array, push name and count to the labels and itemCount arrays
        for (const item of this.purchases) {
          this.labels.push(item._id.name);
          this.itemCount.push(item.count);
        }

        // Set the data object to the labels and itemCount arrays
        this.data = {
          labels: this.labels,
          datasets: [
            // Background colors for the chart
            {
              backgroundColor: [
                '#1e472c',
                '#2a623d',
                '#5d5d5d',
                '#aaaaaa',
                '#367d4e',
                '#494949',
                '#717171',
              ],
              hoverBackgroundColor: [
                '#1e472c',
                '#2a623d',
                '#5d5d5d',
                '#aaaaaa',
                '#367d4e',
                '#494949',
                '#717171',
              ],
              data: this.itemCount,
            },
          ],
        };

        //console.log(this.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit() {}
}
