/**
 * Title: invoice-routes.js
 * Modified By: Michael Christman, Zahava Gopin & Jennifer Hoitenga
 * Author: Professor Krasso
 * Date: 12/1/2023
 * Sources:
 * BCRS Starter Project: https://github.com/buwebdev/web-450/tree/master/starter-projects/bcrs
 * Validating data with JSON Schema: https://tane.dev/2019/09/validating-data-with-json-schema-angular-and-typescript/
 */

// Require statement for Express
const express = require("express");
// Require statement for Router
const router = express.Router();
// Import the Invoice model
const Invoice = require("../models/invoice");
// Import the User model
const User = require("../models/user");
// Import Ajv (Another JSON Schema Validator) for data validation
const Ajv = require("ajv");
// Create a new instance of Ajv for JSON schema validation
const ajv = new Ajv();

const invoiceSchema = {
  type: "object",
  required: [
    "orderDate",
    "customerFullName",
    "customerEmail",
    "lineItems",
    "partsAmount",
    "laborAmount",
    "lineItemTotal",
    "invoiceTotal",
  ],
  additionalProperties: false,
  properties: {
    orderDate: { type: "string" },
    customerFullName: { type: "string" },
    customerEmail: { type: "string" },
    partsAmount: { type: "number" },
    laborAmount: { type: "number" },
    lineItemTotal: { type: "number" },
    invoiceTotal: { type: "number" },
    lineItems: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "price"],
        properties: {
          name: { type: "string" },
          price: { type: "number" },
        },
      },
    },
  },
};

/************************************************************************************** */
/**
 * createInvoice
 * @openapi
 * /api/invoices/{id}:
 *   post:
 *     tags:
 *       - Invoices
 *     name: createInvoice
 *     description:  Creates a new invoice.
 *     summary: Creates a new invoice.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Enter a valid user id
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderDate
 *               - customerFullName
 *               - customerEmail
 *               - lineItems
 *               - partsAmount
 *               - laborAmount
 *               - lineItemTotal
 *               - invoiceTotal
 *             properties:
 *               orderDate:
 *                 type: string
 *               customerFullName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *               partsAmount:
 *                 type: number
 *               laborAmount:
 *                 type: number
 *               lineItemTotal:
 *                 type: number
 *               invoiceTotal:
 *                 type: number
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
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

router.post("/invoices/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Attempt to find a user in the database using the provided ID.
    const user = await User.findOne({ _id: req.params.id });

    // If no user is found with the given ID, respond with a 404 status and message.
    if (!user) {
      // If the user does not exist, send a 404 response
      return res.status(404).send({ message: "User not found" });
    }

    // Create a new invoice object
    const newInvoice = {
      userId: userId,
      orderDate: req.body.orderDate,
      customerFullName: req.body.customerFullName,
      customerEmail: req.body.customerEmail,
      lineItems: req.body.lineItems,
      partsAmount: req.body.partsAmount,
      laborAmount: req.body.laborAmount,
      lineItemTotal: req.body.lineItemTotal,
      invoiceTotal: req.body.invoiceTotal,
    };

    // Validate the request body using the schema
    const incomingInvoice = req.body;
    const validator = ajv.compile(invoiceSchema);
    const valid = validator(incomingInvoice);

    // If the request body is valid, create the invoice
    if (valid) {
      const invoice = await Invoice.create(newInvoice);
      // Invoice created successfully
      res.json(invoice);
    } else {
      // Request body is not valid
      console.log("Body does not match schema");
      console.log(validator.errors);
      res.status(400).send({
        message: "Request body must match invoice schema",
        error: validator.errors,
      });
    }
  } catch (err) {
    if (err.kind === "ObjectId") {
      // Respond with a 400 status and a message indicating an invalid user ID.
      return res.status(400).send({ message: "Invalid User Id" });
    } else {
      // Error creating invoice
      console.log(err);
      res.status(500).send({ message: "Internal server error" });
    }
  }
});

/************************************************************************************** */
/**
 * findPurchasesByService
 * @openapi
 * /api/invoices/purchases-graph:
 *   get:
 *     tags:
 *       - Invoices
 *     name: findPurchaseByService
 *     description: API for returning purchases by service
 *     summary: Returns purchases by service
 *     responses:
 *       '200':
 *         description: Success
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.get("/invoices/purchases-graph", async (req, res) => {
  try {
    const purchases = await Invoice.aggregate([
      {
        $unwind: "$lineItems",
      },
      {
        $group: {
          _id: {
            name: "$lineItems.name",
            price: "$lineItems.price",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.name": 1,
        },
      },
    ]);

    res.json(purchases);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Export the router
module.exports = router;
