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

router.get("/", async (req, res) => {
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
    console.log(err);
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

// findById route

// createUser route

// updateUser route

// deleteUser route

// Export the router module for use in other parts of the application.
module.exports = router;
