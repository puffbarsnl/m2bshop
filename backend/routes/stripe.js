const express = require("express");
const Stripe = require("stripe");
const { sendPaymentReceive } = require("../middleware/mailersend");
// const sendEmail = require("../middleware/sendEmail");
const { Order } = require("../models/Order");
const { Product } = require('../models/Product');

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY || "whsec_e8cf64f742a9a2507c977eacc956926a7f486af7a44674752a92815cb4a7bd01");

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {

	console.log(req.body);

  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId ? req.body.userId : "NOACCOUNT",
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image.url],
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  // "sofort", "bancontact", "klarna", "customer_balance", "sepa_debit", "giropay", "eps",
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["ideal", "sofort", "bancontact", "klarna", "customer_balance", "sepa_debit", "giropay", "eps",],
    shipping_address_collection: {
      allowed_countries: ["NL", "US", "AT", "BE", "DK", "FI", "DE", "IE", "IT", "NO", "PT", "RO", "SE", "ES", "CH", "GB",],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "eur",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 15,
            },
          },
        }}],
    line_items,
    mode: "payment",
    customer: customer.id,
    locale: "nl",
    allow_promotion_codes: true,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  // res.redirect(303, session.url);
  res.send({ url: session.url });
});

// Create order function

const createOrder = async (customer, data, line_items) => {
  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: line_items.data,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_method: "stripe",
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    // await sendPaymentReceive(customer.email, "Your payment has been received", customer.id)
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }
};

// Stripe webhoook

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;


    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
			console.log(event.data.object);
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            stripe.checkout.sessions.listLineItems(
              data.id,
              {},
              function (err, lineItems) {
                console.log("line items", lineItems);
								// sendEmail(customer.email, "Uw Gunblaster.nl bestelling!", "Uw bestelling is ontvangen en zal zo spoedig mogelijk verzonden worden. Klik hieronder om uw bestellingstatus te bekijken.")
								createOrder(customer, data, lineItems);

              }
            );
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }

    res.status(200).end();
  }
);

module.exports = router;
