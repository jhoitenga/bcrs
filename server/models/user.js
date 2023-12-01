/**
 * Title: user.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/15/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

// Importing Mongoose
const mongoose = require("mongoose");

// Import Schemas
const UserRoleSchema = require("./user-role");
const SelectedSecurityQuestionsSchema = require("./selected-security-questions");

// Create a Schema object from Mongoose to define the structure of our data.
const Schema = mongoose.Schema;

// User Schema
let UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  isDisabled: { type: Boolean, default: false },
  role: UserRoleSchema,
  selectedSecurityQuestions: [SelectedSecurityQuestionsSchema],
  dateCreated: { type: Date, default: new Date() },
  dateModified: { type: Date },
  lastSignIn: { type: Date },
});

// Create and export a Mongoose model named "User" using the defined schema.
module.exports = mongoose.model("User", UserSchema);
