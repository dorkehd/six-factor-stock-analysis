const express = require('express');
const { analyzeStock } = require('../services/stockAnalysis');

const router = express.Router();

router.get('/analyze/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const analysis = await analyzeStock(ticker);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { stockAnalysisRouter: router };