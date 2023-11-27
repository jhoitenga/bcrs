/**
 * Title: user-routes.js
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

const role = require("../models/role");

// Define a JSON schema for user creation data validation.
const createUserSchema = {
  type: "object",
  properties: {
    // Define the expected properties and their data types.
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    isDisabled: { type: "boolean" },
    role: { type: "string" },
  },
  required: [
    // Specify the required properties that must be present in the object.
    "firstName",
    "lastName",
    "phoneNumber",
    "email",
    "password",
    "address",
    "isDisabled",
    "role",
  ],
  additionalProperties: false,
};

// Define a JSON schema for user update data validation.
const updateUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    role: { type: "string" },
    isDisabled: { type: "boolean" },
  },
  required: [
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "email",
    "role",
  ],
  additionalProperties: false,
};

/************************************************************************************** */
/**
 * findAll
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     name: findAll
 *     description: API for returning a list of users from MongoDB Atlas.
 *     summary: Returns a list of user documents.
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

router.get("/users", async (req, res) => {
  try {
    // Attempt to retrieve all users from the database
    const users = await User.find({});

    // Check if the users array is empty and return a 404 status if true
    if (users.length === 0) {
      return res.status(404).send({ message: "Not Found" });
    }

    // If users are found, send them back with a 200 status
    res.status(200).send(users);
  } catch (err) {
    //console.log(err);
    // No object being called for but using to send a 400 response
    if (err.kind === "ObjectId") {
      // Sending a 400 response for bad requests
      res.status(400).send({ message: "Bad Request" });
    } else {
      // Sending a 500 response for all other server errors
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

/************************************************************************************** */
/**
 * findById
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     name: findById
 *     description:  API for returning User from MongoDB.
 *     summary: Returns a User document by userId.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Enter a valid id
 *         schema:
 *           type: string
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

router.get("/users/:id", async (req, res) => {
  try {
    // Attempt to find a user in the database using the provided ID.
    const user = await User.findOne({ _id: req.params.id });

    // If no user is found with the given ID, respond with a 404 status and message.
    if (!user) {
      //console.log("User was not found");
      return res.status(404).send({ message: "User Id not found" });
    }

    // If a user is found, log the user data and respond with a 200 status and the user object.
    //console.log(user);
    res.status(200).send(user);
  } catch (err) {
    //console.log(err);
    // Check if the error is of type "ObjectId," which typically indicates an invalid user ID.
    if (err.kind === "ObjectId") {
      // Respond with a 400 status and a message indicating an invalid user ID.
      return res.status(400).send({ message: "Invalid User Id" });
    } else {
      // If the error is not of type "ObjectId," respond with a generic 500 status and an error message.
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

/************************************************************************************** */
/**
 * createUser
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     name: createUser
 *     description: API to create new user
 *     summary: Creates a User document.
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              required:
 *                - text
 *              properties:
 *                firstName:
 *                  type: string
 *                  example: Bob
 *                lastName:
 *                  type: string
 *                  example: Smith
 *                phoneNumber:
 *                  type: string
 *                  example: 555-555-5555
 *                address:
 *                  type: string
 *                  example: 1234 Main St. Bellevue, NE 68123
 *                email:
 *                  type: string
 *                  example: Bob@bcrs.org
 *                password:
 *                  type: string
 *                  example: Password1
 *                isDisabled:
 *                  type: boolean
 *                  example: false
 *                role:
 *                  type: string
 *                  example: standard
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

router.post("/users", async (req, res) => {
  try {
    // Extract the new user data from the request body.
    const newUser = req.body;
    console.log("User", newUser);

    // Compile the JSON schema validator for user creation.
    const validator = ajv.compile(createUserSchema);

    // Validate the new user data against the schema.
    const valid = validator(newUser);

    // If validation fails, return a 400 Bad Request response with error details.
    if (!valid) {
      console.log(validator.errors);
      return res
        .status(400)
        .send({ message: "Bad Request", errors: validator.errors });
    }

    // Check for a valid 'isDisabled' flag (must be true or false).
    if (newUser.isDisabled !== true && newUser.isDisabled !== false) {
      return res.status(404).send({ message: "Invalid value for isDisabled." });
    }

    // Hash the user's password for secure storage.
    let hashedPassword = bcrypt.hashSync(newUser.password, saltRounds);

    // Construct the new user object for database insertion.
    const createNewUser = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      address: newUser.address,
      email: newUser.email,
      password: hashedPassword,
      isDisabled: newUser.isDisabled,
      role: { text: newUser.role },
    };

    // Create the new user in the database.
    const user = await User.create(createNewUser);

    // Respond with a 201 status code indicating successful creation.
    res.status(201).json({
      message:
        user.firstName + " " + user.lastName + " was created successfully!",
    });
  } catch (err) {
    console.log(err);

    // Handle duplicate email error with a 400 Bad Request response.
    if (err.code === 11000) {
      return res.status(400).send({ message: "Email already in use" });
    } else {
      // For any other errors, return a 500 Internal Server Error response.
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

/************************************************************************************** */
/**
 * updateUser
 * @openapi
 * /api/users/{id}:
 *  put:
 *      tags:
 *          - Users
 *      name: updateUser
 *      description: API to update an existing user
 *      summary: Updates a User document.
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: Enter a valid id
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  firstName:
 *                    type: string
 *                  lastName:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *                  address:
 *                    type: string
 *                  email:
 *                    type: string
 *                  role:
 *                    type: string
 *                    example: standard
 *      responses:
 *          '204':
 *              description: No Content
 *          '400':
 *              description: Bad request
 *          '404':
 *              description: Not Found
 *          '500':
 *              description: Internal Server Error
 */

router.put("/users/:id", async (req, res) => {
  try {
    // Extract the updated user data from the request body
    const updatedUser = req.body;
    // Compile a JSON schema validator for the updated user data
    const validator = ajv.compile(updateUserSchema);
    // Validate the updated user data against the schema
    const valid = validator(updatedUser);

    if (valid) {
      // Find the user by their ID in the database
      const user = await User.findOne({ _id: req.params.id });
      if (user) {
        // Update the user's properties with data from the request body
        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          email: req.body.email,
          "role.text": req.body.role,
          isDisabled: req.body.isDisabled,
          dateModified: new Date(),
        });

        // Save the updated user to the database
        const savedUser = await user.save();
        //console.log(savedUser);

        // Respond with a 204 No Content status code to indicate success
        res.status(204).end();
      } else {
        // Respond with a 404 Not Found status code if the user was not found
        res.status(404).send({ message: "User Id not found" });
      }
    } else {
      //console.log(validator.errors);
      // Log validation errors and respond with a 400 Bad Request status code
      res
        .status(400)
        .send({ message: "Bad Request - check input in request body." });
    }
  } catch (err) {
    //console.log(err);
    // Log any unexpected errors and respond with a 500 Internal Server Error status code
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/************************************************************************************** */
/**
 * deleteUser
 * @openapi
 * /api/users/{id}:
 *  delete:
 *      tags:
 *          - Users
 *      description: API for disabling a user
 *      summary: Updates the isDisabled flag to true for a user document.
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: Enter a valid id
 *            schema:
 *              type: string
 *      responses:
 *          '204':
 *              description: No Content
 *          '400':
 *              description: Bad Request
 *          '404':
 *              description: Not Found
 *          '500':
 *              description: Internal Server Error
 */

// Import the ObjectId class from Mongoose to check for a valid object ID.
const ObjectId = require("mongoose").Types.ObjectId;

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the provided ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      // Respond with a 400 Bad Request status if the ID is invalid
      return res.status(400).send({ message: "Invalid user Id format" });
    }

    // Find a user with the provided ID in the database
    const user = await User.findOne({ _id: id });
    //console.log(user);

    if (!user) {
      // Respond with a 404 Not Found status if the user is not found
      return res.status(404).send({ message: "User Id not found" });
    }

    // Set the 'isDisabled' flag to true and update the 'dateModified' field
    user.set({
      isDisabled: true,
      dateModified: new Date(),
    });

    try {
      // Save the updated user in the database
      await user.save();
      // Respond with a 204 No Content status indicating success
      res.status(204).end();
    } catch (err) {
      //console.error(err);
      // Respond with a 500 Internal Server Error status if there's an error while saving
      res.status(500).send({ message: "Internal Server Error" });
    }
  } catch (err) {
    //console.error(err);
    // Respond with a 500 Internal Server Error status for any other unexpected errors
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/************************************************************************************** */
/**
 * findSelectedSecurityQuestions
 * @openapi
 * /api/users/{email}/security-questions:
 *   post:
 *     tags:
 *       - Users
 *     name: findSelectedSecurityQuestions
 *     description: Returns selected security questions for a user
 *     summary: Returns selected security questions for a user
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Enter the email address for the user
 *         schema:
 *           type: string
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

router.post("/users/:email/security-questions", async (req, res) => {
  try {
    // Extract the email from the route parameter
    const email = req.params.email;
    // Check if the email is not provided or is not valid
    if (!email || !isValidEmail(email)) {
      // Respond with a 400 Bad Request status and an error message
      res.status(400).send({ message: "Invalid email format" });
    }

    // Find a user with the specified email in the database
    const user = await User.findOne({ email: req.params.email });
    console.log(user);
    // If the user is not found in the database, respond with a 404 Not Found status
    if (user === null) {
      res.status(404).send({ message: "User not found." });
    } else {
      // Map the selected security questions of the user to extract question text only
      const questions = user.selectedSecurityQuestions.map((q) => ({
        questionText: q.questionText,
      }));
      // Respond with a JSON object containing user information and selected security questions
      res.json({
        message: "User found!",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        selectedSecurityQuestions: questions,
      });
    }
  } catch (err) {
    console.log(err);
    // Handle any unexpected errors and respond with a 500 Internal Server Error status
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Function to validate an email address using a regular expression
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Export the router module for use in other parts of the application.
module.exports = router;
