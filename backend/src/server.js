const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS for our domain
app.use(cors({
  origin: ['https://buysellhold.live', 'https://www.buysellhold.live', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Analysis endpoint
app.get('/api/analyze/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    // Analysis logic will go here
    res.json({
      currentPrice: 100, // Placeholder
      fcfTargetPrice: 120,
      ddmTargetPrice: 125,
      overallScore: 85,
      factors: {
        valuation: 82,
        risks: 88,
        unitEconomics: 90,
        customerValue: 85,
        marketSize: 80,
        competition: 87
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
