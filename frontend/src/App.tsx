import type { FC } from 'react';
import { StockAnalysis } from './components/StockAnalysis';

const App: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StockAnalysis />
    </div>
  );
};

export default App;