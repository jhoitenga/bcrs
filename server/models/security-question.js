/**
 * Title: security-question.js
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

// Security Question Schema
let securityQuestionSchema = new Schema({
  text: { type: String },
  isDisabled: { type: Boolean, default: false },
});

// Create and export a Mongoose model named "Security Question" using the defined schema.
module.exports = mongoose.model("SecurityQuestion", securityQuestionSchema);
