const axios = require('axios');
const NodeCache = require('node-cache');

// Cache setup
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

async function analyzeStock(ticker) {
  try {
    // Check cache first
    const cachedAnalysis = cache.get(ticker);
    if (cachedAnalysis) return cachedAnalysis;

    // Fetch data from Alpha Vantage
    const overview = await fetchStockOverview(ticker);
    const income = await fetchIncomeStatement(ticker);
    const balance = await fetchBalanceSheet(ticker);
    const cashflow = await fetchCashFlow(ticker);

    // Calculate analysis based on the 6-factor framework
    const analysis = {
      currentPrice: parseFloat(overview.price),
      fcfTargetPrice: calculateFCFTargetPrice(cashflow, overview),
      ddmTargetPrice: calculateDDMTargetPrice(overview),
      overallScore: 0,
      factors: {
        valuation: calculateValuationScore(overview, income),
        risks: calculateRiskScore(balance, income),
        unitEconomics: calculateUnitEconomicsScore(income),
        customerValue: calculateCustomerValueScore(income),
        marketSize: calculateMarketSizeScore(overview),
        competition: calculateCompetitionScore(overview, income)
      }
    };

    // Calculate overall score with weighted factors
    analysis.overallScore = calculateOverallScore(analysis.factors);

    // Cache the results
    cache.set(ticker, analysis);

    return analysis;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(`Failed to analyze stock: ${error.message}`);
  }
}

// Alpha Vantage API calls
async function fetchStockOverview(ticker) {
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  );
  return response.data;
}

async function fetchIncomeStatement(ticker) {
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  );
  return response.data;
}

async function fetchBalanceSheet(ticker) {
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  );
  return response.data;
}

async function fetchCashFlow(ticker) {
  const response = await axios.get(
    `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  );
  return response.data;
}

// Analysis calculations
function calculateFCFTargetPrice(cashflow, overview) {
  const fcf = parseFloat(cashflow.freeCashFlow);
  const shares = parseFloat(overview.SharesOutstanding);
  const growthRate = 0.03; // Conservative growth rate
  const discountRate = 0.1; // 10% discount rate

  const terminalValue = fcf * (1 + growthRate) / (discountRate - growthRate);
  return (terminalValue / shares).toFixed(2);
}

function calculateDDMTargetPrice(overview) {
  const dividend = parseFloat(overview.DividendPerShare);
  const growthRate = 0.03;
  const requiredReturn = 0.09;

  return ((dividend * (1 + growthRate)) / (requiredReturn - growthRate)).toFixed(2);
}

function calculateOverallScore(factors) {
  const weights = {
    valuation: 0.4,
    risks: 0.15,
    unitEconomics: 0.15,
    customerValue: 0.1,
    marketSize: 0.1,
    competition: 0.1
  };

  return Object.entries(factors).reduce((total, [factor, score]) => {
    return total + (score * weights[factor]);
  }, 0).toFixed(1);
}

// Individual factor calculations
function calculateValuationScore(overview, income) {
  // Implementation based on the book's valuation metrics
  return 85; // Placeholder
}

function calculateRiskScore(balance, income) {
  // Implementation based on the book's risk assessment
  return 80; // Placeholder
}

function calculateUnitEconomicsScore(income) {
  // Implementation based on the book's unit economics metrics
  return 75; // Placeholder
}

function calculateCustomerValueScore(income) {
  // Implementation based on the book's customer value metrics
  return 90; // Placeholder
}

function calculateMarketSizeScore(overview) {
  // Implementation based on the book's market size assessment
  return 85; // Placeholder
}

function calculateCompetitionScore(overview, income) {
  // Implementation based on the book's competition analysis
  return 70; // Placeholder
}

module.exports = {
  analyzeStock
};