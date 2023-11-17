/**
 * Title: app.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/15/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 */
"use strict";

// Require statements
const express = require("express");
const createServer = require("http-errors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const userRoute = require("./routes/user-routes");
const sessionRoute = require("./routes/session-routes");
const mongoose = require("mongoose");

// Connecting to MongoDB
const CONN =
  "mongodb+srv://bcrs_user:s3cr3t@bellevueuniversity.g473hiy.mongodb.net/bcrs";

// Showing Server Connection Messages
mongoose
  .connect(CONN, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connection to BCRS MongoDB database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });

// Configuration for generating Swagger/OpenAPI documentation.
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bob's Computer Repair Shop RESTful APIs",
      version: "1.0.0",
      description: "BCRS OpenAPI Documentation",
    },
  },
  apis: ["./server/routes/*"], // Specify the API routes to document.
};

// Create the Express app
const app = express();

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/bcrs")));
app.use("/", express.static(path.join(__dirname, "../dist/bcrs")));

// Generate OpenAPI documentation using Swagger and serve it at "/api-docs".
const openapiSpecification = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Use the user API routes at "/api".
app.use("/api/users", userRoute);
app.use("/api/session", sessionRoute);

// error handler for 404 errors
app.use(function (req, res, next) {
  next(createServer(404)); // forward to error handler
});

// error handler for all other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500); // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

module.exports = app; // export the Express application
