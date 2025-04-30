const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// In-memory storage for the latest data
let latestData = null;

// Webhook endpoint
app.post('/api/webhook', async (req, res) => {
  const data = req.body;
  latestData = data;

  try {
    // Forward to Vercel API
    const response = await fetch(process.env.VERCEL_FORWARD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log('Webhook forwarded to Vercel:', data);
    res.status(200).send('Webhook forwarded successfully');
  } catch (err) {
    console.error('Failed to forward webhook:', err);
    res.status(500).send('Failed to forward webhook');
  }
});

// Endpoint to retrieve the latest data
app.get('/api/latest', (req, res) => {
  if (latestData) {
    res.json(latestData);
  } else {
    res.status(404).send('No data available');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook forwarder running on port ${PORT}`);
});
