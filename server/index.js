require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();

const stripe = new Stripe(process.env.PRIVATE_KEY);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/api/checkout', async (req, res) => {
	try {
		const { amount, id } = req.body;
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: 'USD',
			description: 'Gaming Keyboard Testing',
			payment_method: id,
			confirm: true,
		});

		res.send({ message: `${payment.status} payment` });
	} catch (error) {
		// console.error(error);
		res.json({ message: error.raw.message });
	}
});

app.listen('3001', () => console.log(`Server on port`, 3001));
