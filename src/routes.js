const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE_URL = "https://api.sandbox.midtrans.com/v2";

// Create a transaction
router.post("/create-transaction", async (req, res) => {
  try {
    const { orderId, grossAmount, customerDetails, itemDetails } = req.body;
    const response = await axios.post(
      `${MIDTRANS_BASE_URL}/charge`,
      {
        payment_type: "bank_transfer",
        bank_transfer: {
          bank: "bca",
        },
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        customer_details: customerDetails,
        item_details: itemDetails,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY).toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check transaction status
router.get("/check-transaction/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const response = await axios.get(`${MIDTRANS_BASE_URL}/${orderId}/status`, {
      headers: {
        Authorization: `Basic ${Buffer.from(MIDTRANS_SERVER_KEY).toString(
          "base64"
        )}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
