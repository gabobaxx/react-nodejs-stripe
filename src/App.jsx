import 'bootswatch/dist/lux/bootstrap.min.css';
import './App.css';

import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useState } from 'react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(PUBLIC_KEY);

const CheckoutForm = () => {
	const [loading, setLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardElement),
		});
		setLoading(true);

		if (!error) {
			const { id } = paymentMethod;
			try {
				const { data } = await axios.post(
					'http://localhost:3001/api/checkout',
					{
						id,
						amount: 10000,
					}
				);
				console.log(data);
				elements.getElement(CardElement).clear();
			} catch (error) {
				console.log(error);
			}

			setLoading(false);
		}
	};

	return (
		<form className="card card-body" onSubmit={handleSubmit}>
			<img
				src="https://www.corsair.com/medias/sys_master/images/images/h80/hdd/9029904465950/-CH-9109011-ES-Gallery-K70-RGB-MK2-01.png"
				alt="Corsair Gaming Keyboard RGB"
				className="img-fluid"
			/>
			<h3 className="text-center my-2">Price: 100$</h3>
			<div className="form-group">
				<CardElement className="form-control" />
			</div>
			<button className="btn btn-success" disabled={!stripe}>
				{loading ? (
					<div className="spinner-border text-light" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				) : (
					'Buy'
				)}
			</button>
		</form>
	);
};
const App = () => {
	return (
		<Elements stripe={stripePromise}>
			<div className="container p-4">
				<div className="row">
					<div className="col-md-4 offset-md-4">
						<CheckoutForm />
					</div>
				</div>
			</div>
		</Elements>
	);
};

export default App;
