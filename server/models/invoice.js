/**
 * Title: invoice.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/15/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

// Importing Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const lineItemDocument = require("./line-item");

// Invoice Schema
const invoiceSchema = new Schema({
  userId: { type: String },
  orderDate: { type: Date },
  customerFullName: { type: String },
  customerEmail: { type: String },
  lineItems: [lineItemDocument],
  partsAmount: { type: Number },
  laborAmount: { type: Number },
  lineItemTotal: { type: Number },
  invoiceTotal: { type: Number },
});

// Create and export a Mongoose model named "Invoice" using the defined schema.
module.exports = mongoose.model("Invoice", invoiceSchema);
