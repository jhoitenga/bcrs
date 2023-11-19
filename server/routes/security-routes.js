/**
 * Title: session-routes.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 11/15/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Validating data with JSON Schema: https://tane.dev/2019/09/validating-data-with-json-schema-angular-and-typescript/
 */

// Require statement for Express
const express = require("express");
// Require statement for Router
const router = express.Router();
// Import the User model
const User = require("../models/user");
// Import bcrypt for password hashing
const bcrypt = require("bcryptjs");
// Define the number of bcrypt rounds to use when hashing the password
const saltRounds = 10;
// Import Ajv (Another JSON Schema Validator) for data validation
const Ajv = require("ajv");
// Create a new instance of Ajv for JSON schema validation
const ajv = new Ajv();

// Define a schema for user authentication during sign-in.
const securitySigninSchema = {
  type: "object",
  // Define the expected properties and their data types.
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  // Specify the required properties that must be present in the object.
  required: ["email", "password"],
  additionalProperties: false,
};

/************************************************************************************** */
/**
 * signin
 * @openapi
 * /api/security/signin:
 *   post:
 *     tags:
 *       - Security
 *     name: signin
 *     description: API for signing in a user.
 *     summary: Sign in a user.
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     required:
 *                         - email
 *                         - password
 *                     properties:
 *                         email:
 *                           type: string
 *                         password:
 *                           type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

router.post("/security/signin", async (req, res) => {
  try {
    // Retrieve the user sign-in data from the request body.
    const securitySignin = req.body;
    // Compile the schema for validation using the AJV library.
    const validator = ajv.compile(securitySigninSchema);
    // Validate the user sign-in data against the defined schema.
    const valid = validator(securitySignin);

    console.log("Schema validation result:", valid);
    // Check if the data is valid according to the schema.
    if (!valid) console.log("Validation errors:", validator.errors);

    // If the data is valid according to the schema:
    if (valid) {
      const user = await User.findOne({ email: req.body.email });
      //console.log("Searching for user with email:", req.body.email);

      // If a user with the given email exists:
      if (user) {
        // Check if the user is not disabled.
        if (!user.isDisabled) {
          // Compare the provided password with the stored hashed password.
          let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          console.log("Password valid:", passwordIsValid);

          // If the password is valid:
          if (passwordIsValid) {
            console.log("Login successful");
            // Send a success response.
            res.status(200).send(user);
          } else {
            // Send a 404 response for invalid password.
            res.status(404).send({ message: "Password is invalid" });
          }
        } else {
          // Send a 400 response for a disabled user account.
          res.status(400).send({ message: "Account is disabled" });
        }
      } else {
        // Send a 404 response for email not found in the database.
        res.status(404).send({ message: "Email not found" });
      }
    } else {
      // Log validation errors and send a 400 response for a bad request.
      console.log(validator.errors);
      res.status(400).send({ message: "Bad Request" });
    }
  } catch (err) {
    // Log any errors that occur during the sign-in process and send a 500 response.
    //console.log("Error in signin route:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Export the router module for use in other parts of the application.
module.exports = router;
