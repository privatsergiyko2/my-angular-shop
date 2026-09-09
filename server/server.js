const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.post('/create-checkout', (req, res) => {
  const amount = req.body.amount;
  console.log(amount);
  res.json({
    amount: amount,
    success: true,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
