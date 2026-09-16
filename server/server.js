

const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();
const cors = require('cors');
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from server');
});
app.post("/create-payment-intent", async (req, res) => {
  const amount = req.body.amount;
  const currency = req.body.currency;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency
    });

    res.json({
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


//
// app.post('/create-checkout', (req, res) => {
//   const amount = req.body.amount;
//   console.log(amount);
//   res.json({
//     amount: amount,
//     success: true,
//   });
// });

