/**
 * Title: role.js
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

// Role Schema
const roleSchema = new Schema({
  text: { type: String, unique: true },
  isDisabled: { type: Boolean, default: false },
});

// Create and export a Mongoose model named "Role" using the defined schema.
module.exports = mongoose.model("Role", roleSchema);
