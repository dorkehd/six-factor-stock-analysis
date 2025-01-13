const axios = require('axios');

async function getStockData(ticker) {
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
  const baseUrl = 'https://www.alphavantage.co/query';
  
  try {
    // Get overview data
    const overviewResponse = await axios.get(`${baseUrl}?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`);
    
    // Get income statement data
    const incomeResponse = await axios.get(`${baseUrl}?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${API_KEY}`);
    
    return {
      overview: overviewResponse.data,
      income: incomeResponse.data
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
}

async function analyzeStock(ticker) {
  const data = await getStockData(ticker);
  
  // Calculate factors
  const customerValue = analyzeCustomerValue(data);
  const unitEconomics = analyzeUnitEconomics(data);
  const marketSize = analyzeMarketSize(data);
  const competition = analyzeCompetition(data);
  const risks = analyzeRisks(data);
  const valuation = analyzeValuation(data);
  
  // Calculate weighted score
  const weightedScore = calculateWeightedScore({
    valuation: { score: valuation, weight: 0.4 },
    risks: { score: risks, weight: 0.15 },
    unitEconomics: { score: unitEconomics, weight: 0.15 },
    customerValue: { score: customerValue, weight: 0.1 },
    marketSize: { score: marketSize, weight: 0.1 },
    competition: { score: competition, weight: 0.1 }
  });

  return {
    ticker,
    factors: {
      customerValue,
      unitEconomics,
      marketSize,
      competition,
      risks,
      valuation
    },
    weightedScore,
    recommendation: getRecommendation(weightedScore)
  };
}

function analyzeCustomerValue(data) {
  // Analyze gross margin trend, revenue growth, and market position
  const grossMargin = parseFloat(data.overview.GrossProfitTTM) / parseFloat(data.overview.RevenueTTM) * 100;
  return normalizeScore(grossMargin, 0, 40); // Normalize between 0-100
}

function analyzeUnitEconomics(data) {
  // Analyze profitability metrics
  const operatingMargin = parseFloat(data.overview.OperatingMarginTTM) * 100;
  return normalizeScore(operatingMargin, -10, 30);
}

function analyzeMarketSize(data) {
  // Analyze market cap and industry size
  const marketCap = parseFloat(data.overview.MarketCapitalization);
  return normalizeScore(Math.log10(marketCap), 8, 12); // Log scale for market cap
}

function analyzeCompetition(data) {
  // Analyze competitive position
  const peRatio = parseFloat(data.overview.PERatio);
  return normalizeScore(peRatio, 5, 30);
}

function analyzeRisks(data) {
  // Analyze beta and debt levels
  const beta = parseFloat(data.overview.Beta);
  const debtToEquity = parseFloat(data.overview.DebtToEquityRatio);
  return 100 - normalizeScore((beta + debtToEquity/2), 0.5, 3);
}

function analyzeValuation(data) {
  // Analyze various valuation metrics
  const pe = parseFloat(data.overview.PERatio);
  const pb = parseFloat(data.overview.PriceToBookRatio);
  const score = (normalizeScore(pe, 5, 30) + normalizeScore(pb, 0.5, 5)) / 2;
  return 100 - score; // Invert so lower valuations score higher
}

function normalizeScore(value, min, max) {
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
}

function calculateWeightedScore(factors) {
  return Object.values(factors).reduce((total, factor) => {
    return total + (factor.score * factor.weight);
  }, 0);
}

function getRecommendation(score) {
  if (score >= 80) return 'Strong Buy';
  if (score >= 60) return 'Buy';
  if (score >= 40) return 'Hold';
  if (score >= 20) return 'Sell';
  return 'Strong Sell';
}

module.exports = {
  analyzeStock
};