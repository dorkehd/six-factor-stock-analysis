import { useState, type FC } from 'react';

interface AnalysisData {
  currentPrice: number;
  fcfTargetPrice: number;
  ddmTargetPrice: number;
  overallScore: number;
  factors: {
    valuation: number;
    risks: number;
    unitEconomics: number;
    customerValue: number;
    marketSize: number;
    competition: number;
  };
}

export const StockAnalysis: FC = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    currentPrice: 0,
    fcfTargetPrice: 0,
    ddmTargetPrice: 0,
    overallScore: 0,
    factors: {
      valuation: 0,
      risks: 0,
      unitEconomics: 0,
      customerValue: 0,
      marketSize: 0,
      competition: 0
    }
  });

  const handleAnalysis = async () => {
    if (!ticker) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/analyze/${ticker}`);
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setAnalysisData(data as AnalysisData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Stock Analysis</h1>
        <p className="text-gray-600">Analyze stocks using the six-factor framework</p>
      </div>

      <div className="mb-6">
        <div className="max-w-xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalysis();
            }} 
            className="flex gap-2"
          >
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter stock ticker (e.g., AAPL)"
              className="px-4 py-2 border rounded-lg flex-grow"
              disabled={loading}
            />
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {analysisData.currentPrice > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Analysis results will be shown here */}
        </div>
      )}
    </div>
  );
};