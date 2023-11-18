/**
 * Title: user-routes.js
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
      return res.status(404).send({ message: "No users found" });
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
      return res.status(404).send({ message: "User was not found" });
    }

    // If a user is found, log the user data and respond with a 200 status and the user object.
    //console.log(user);
    res.status(200).send(user);
  } catch (err) {
    //console.log(err);
    // Check if the error is of type "ObjectId," which typically indicates an invalid user ID.
    if (err.kind === "ObjectId") {
      // Respond with a 400 status and a message indicating an invalid user ID.
      return res.status(400).send({ message: "Invalid User ID" });
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
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                address:
 *                  type: string
 *                role:
 *                  type: string
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

/*router.post("/users", async (req, res) => {
  try {
  } catch (err) {}
});*/

/************************************************************************************** */
// updateUser route

/************************************************************************************** */
// deleteUser route

// Export the router module for use in other parts of the application.
module.exports = router;
