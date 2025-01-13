import { useState } from 'react';
import { config } from '../config';

// ... rest of the imports

export const StockAnalysis = () => {
  // ... other code

  const handleAnalysis = async () => {
    if (!ticker) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.apiUrl}/api/analyze/${ticker}`);
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

  // ... rest of the code
};