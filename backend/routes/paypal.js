const express = require('express');
const { Order } = require('../models/Order');

const router = express.Router();

router.post("/", async (req, res) => {
	const {cartItems, userId, shipping, payment_method, name, email, amount, paypal_id, paypal_payer_id } = req.body;

	try {
		const newOrder = await new Order({
			userId: await userId,
			products: await cartItems,
			subtotal: (await amount * 100),
			total: (await amount * 100),
			shipping: {
				shipping,
				name: await name,
				email: await email,
			},
			paypal_id: await paypal_id,
			paypal_payer_id: await paypal_payer_id,
			payment_method: await payment_method,
			payment_status: "paid",
		})

		await newOrder.save();
		res.json({message: "Created Order"})
	} catch (error) {
		console.log(error);
	}
});



module.exports = router;