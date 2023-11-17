/**
 * Title: session-routes.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/15/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */

// Require statement for Express
const express = require("express");

// Require statement for Router
const router = express.Router();

const User = require("../models/user");

// signin route

// Export the router module for use in other parts of the application.
module.exports = router;
