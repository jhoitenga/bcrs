/**
 * Title: line-item.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/15/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

// Importing Mongoose
const mongoose = require("mongoose");

// Create a Schema object from Mongoose to define the structure of our data.
const Schema = mongoose.Schema;

// Line Item Schema
let LineItemSchema = new Schema({
  name: { type: String },
  price: { type: Number },
});

// Exporting the model
module.exports = LineItemSchema;
