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

// RegisterUserSchema
const registerUserSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    address: { type: "string" },
    email: { type: "string" },
    password: {
      type: "string",
      pattern: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[A-Z])[A-Za-z\\d]{8,}$",
    },
    selectedSecurityQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          questionText: { type: "string" },
          answerText: { type: "string" },
        },
        required: ["questionText", "answerText"],
        additionalProperties: false,
      },
    },
  },
  required: ["firstName", "lastName", "email", "password"],
  additionalProperties: false,
};

const verifySecurityQuestionsSchema = {
  type: "object",
  properties: {
    questionText1: { type: "string" },
    answerText1: { type: "string" },
    questionText2: { type: "string" },
    answerText2: { type: "string" },
    questionText3: { type: "string" },
    answerText3: { type: "string" },
  },
  required: [
    "questionText1",
    "answerText1",
    "questionText2",
    "answerText2",
    "questionText3",
    "answerText3",
  ],
  additionalProperties: false,
};

const resetPasswordSchema = {
  type: "object",
  properties: {
    password: {
      type: "string",
      pattern: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[A-Z])[A-Za-z\\d]{8,}$",
    },
  },
  required: ["password"],
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
            user.lastSignIn = new Date();
            user.save();
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

/************************************************************************************** */
/**
 * register
 * @openapi
 * /api/security/register:
 *   post:
 *     tags:
 *       - Security
 *     name: register
 *     description: API for registering a new user
 *     summary: Register a user
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                address:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                selectedSecurityQuestions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      questionText:
 *                        type: string
 *                      answerText:
 *                        type: string
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

router.post("/security/register", async (req, res) => {
  try {
    // Extract the user registration data from the request body.
    const registerUser = req.body;
    console.log(registerUser);
    // Compile the JSON schema validator using the user registration schema.
    const validator = ajv.compile(registerUserSchema);
    // Validate the incoming user registration data against the schema.
    const valid = validator(registerUser);

    if (valid) {
      // Check if a user with the same email already exists in the database.
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        // Hash the user's password using bcrypt with a predefined salt.
        let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
        // Define a standard user role.
        standardRole = { text: "standard" };

        // Create a user object with validated and hashed data.
        let registeredUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          email: req.body.email,
          password: hashedPassword,
          role: standardRole,
          selectedSecurityQuestions: req.body.selectedSecurityQuestions,
        };

        // Create a new user record in the database.
        const newUser = await User.create(registeredUser);

        // Respond with the newly created user object.
        res.json(newUser);
      } else {
        // If a user with the same email already exists, return a 400 Bad Request response.
        console.log("User already exists");
        res.status(400).send({ message: "User already exists" });
      }
    } else {
      // If the incoming data doesn't validate against the schema, return a 400 Bad Request response
      console.log(registerUserValidationError);
      res.status(400).send({ message: registerUserValidationError });
    }
  } catch (err) {
    // Handle any internal server errors by logging the error and returning a 500 Internal Server Error response.
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/************************************************************************************** */
/**
 * verifyUser
 * @openapi
 * /api/security/verify/users/{email}:
 *   post:
 *     tags:
 *       - Security
 *     description: API for verifying a user exists
 *     summary: Verify a user exists
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Enter the email address for the user
 *         schema:
 *            type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.post("/security/verify/users/:email", async (req, res) => {
  try {
    // Extract the email from the route parameter
    const email = req.params.email;
    // Check if the email is not provided or is not valid
    if (!email || !isValidEmail(email)) {
      // Respond with a 400 Bad Request status and an error message
      res.status(400).send({ message: "Invalid email format" });
    }

    // Attempt to find a user in the database with the provided email
    const user = await User.findOne({ email: req.params.email });
    // If a user is found, respond with the user data
    if (user) {
      res.json(user);
    } else {
      // If no user is found, respond with a 404 Not Found status and an error message
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    // If an error occurs, log the error and respond with a 500 Internal Server Error
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Function to validate an email address using a regular expression
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/************************************************************************************** */
/**
 * verifySecurityQuestions
 * @openapi
 * /api/security/verify/users/{email}/security-questions:
 *   post:
 *     tags:
 *       - Security
 *     description: Verifies answers to security questions with saved answers from the database.
 *     summary: Verifies security questions
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Enter the email address for the user
 *         scheme:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText1
 *               - questionText2
 *               - questionText3
 *               - answerText1
 *               - answerText2
 *               - answerText3
 *             properties:
 *               questionText1:
 *                 type: string
 *               questionText2:
 *                 type: string
 *               questionText3:
 *                 type: string
 *               answerText1:
 *                 type: string
 *               answerText2:
 *                 type: string
 *               answerText3:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

router.post(
  "/security/verify/users/:email/security-questions",
  async (req, res) => {
    try {
      // Extract the email from the route parameter
      const email = req.params.email;
      // Check if the email is not provided or is not valid
      if (!email || !isValidEmail(email)) {
        // Respond with a 400 Bad Request status and an error message
        res.status(400).send({ message: "Invalid email format" });
      }

      // Retrieve the request body, which contains the user's provided security questions and answers
      let verifySecurityQuestions = req.body;
      // Validate the request body against a predefined schema using AJV (a JSON Schema validator)
      const validator = ajv.compile(verifySecurityQuestionsSchema);
      const valid = validator(verifySecurityQuestions);

      // If the request body is not valid according to the schema, respond with a 400 Bad Request status
      if (!valid) {
        console.log("Invalid request", validator.errors);
        res.status(400).send({ message: "Invalid request" });
      } else {
        // Find a user with the specified email in the database
        const user = await User.findOne({ email: req.params.email });
        // If the user is not found in the database, respond with a 404 Not Found status
        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }

        // Find the selected security questions of the user based on the provided question text
        const selectedSecurityQuestionOne = user.selectedSecurityQuestions.find(
          (q1) => q1.questionText === req.body.questionText1
        );
        const selectedSecurityQuestionTwo = user.selectedSecurityQuestions.find(
          (q2) => q2.questionText === req.body.questionText2
        );
        const selectedSecurityQuestionThree =
          user.selectedSecurityQuestions.find(
            (q3) => q3.questionText === req.body.questionText3
          );

        //console.log("Stored answer 1:", selectedSecurityQuestionOne.answerText);
        //console.log("Received answer 1:", req.body.answerText1);
        //console.log("Stored answer 2:", selectedSecurityQuestionTwo.answerText);
        //console.log("Received answer 2:", req.body.answerText2);
        //console.log("Stored answer 3:",selectedSecurityQuestionThree.answerText);
        //console.log("Received answer 3:", req.body.answerText3);
        // Check if the provided answers match the answers associated with the selected security questions
        const isValidAnswerOne =
          selectedSecurityQuestionOne.answerText === req.body.answerText1;
        const isValidAnswerTwo =
          selectedSecurityQuestionTwo.answerText === req.body.answerText2;
        const isValidAnswerThree =
          selectedSecurityQuestionThree.answerText === req.body.answerText3;

        // If all answers are correct, respond with success, otherwise respond with an error message
        if (isValidAnswerOne && isValidAnswerTwo && isValidAnswerThree) {
          const response = {
            selectedSecurityQuestions: user.selectedSecurityQuestions,
          };
          console.log(
            `User ${user.email} answered all security questions correctly`
          );
          res.json(response);
        } else {
          console.log(
            `User ${user.email} answered one or more security questions incorrectly`
          );

          res.status(400).send({ message: "One or more answers are invalid" });
          //res.json({ message: "error" });
        }
      }
    } catch (err) {
      // Handle any unexpected errors and respond with a 500 Internal Server Error status
      console.log(err);
      res.status(500).send(verifySecurityQuestionCatchErrorResponse.toObject());
    }
  }
);

/************************************************************************************** */
/**
 * resetPassword
 * @openapi
 * /api/security/users/{email}/reset-password:
 *   post:
 *     tags:
 *       - Security
 *     description: API for resetting a user's password
 *     summary: Reset a user's password
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Enter the email address for the user
 *         schema:
 *            type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                password:
 *                  type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

router.post("/security/users/:email/reset-password", async (req, res) => {
  try {
    // Extract the request body, which contains session data for resetting the password
    const sessionResetPassword = req.body;
    // Validate the request body against a predefined schema using AJV (a JSON Schema validator)
    const validator = ajv.compile(resetPasswordSchema);
    const valid = validator(sessionResetPassword);

    // If the request body is not valid according to the schema, respond with a 400 Bad Request status
    if (!valid) {
      console.log("Validation errors:", validator.errors);
      return res.status(400).send({
        message: "Invalid request, password does not meet requirements",
      });
    }

    // If the request body is valid, proceed to reset the user's password
    if (valid) {
      // Find a user with the specified email in the database
      const user = await User.findOne({ email: req.params.email });
      // If the user is found in the database, update their password
      if (user) {
        // Hash the new password using bcrypt and the specified salt rounds
        let hashedPassword = bcrypt.hashSync(
          sessionResetPassword.password,
          saltRounds
        );

        // Set the user's password to the hashed password
        user.set({
          password: hashedPassword,
        });

        // Save the updated user object to the database
        const updatedUser = await user.save();
        console.log(updatedUser);
        // Respond with a 200 OK status and a success message
        res.status(200).send({ message: "Password successfully reset" });
      } else {
        // If the user is not found in the database, respond with a 404 Not Found status
        res.status(404).send({ message: "User not found" });
      }
    }
  } catch (err) {
    // Handle any unexpected errors and respond with a 500 Internal Server Error status
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Export the router module for use in other parts of the application.
module.exports = router;
