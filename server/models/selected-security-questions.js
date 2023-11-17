/**
 * Title: selected-security-question.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/15/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

// Importing Mongoose
const mongoose = require("mongoose");

// Import Schemas
const Schema = mongoose.Schema;

// Selected Security Questions Schema
let SelectedSecurityQuestionsSchema = new Schema({
  questionText: { type: String },
  answerText: { type: String },
});

// Exporting the model
module.exports = SelectedSecurityQuestionsSchema;
