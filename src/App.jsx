import { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import CashFlowChart from './components/CashFlowChart';
import { calculate } from './utils/calculations';
import './App.css';

const DEFAULT_VALUES = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 24,
};

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);

  const { initialInvestment, monthlyRevenue, monthlyCosts, period } = values;
  const result = calculate(
    Number(initialInvestment) || 0,
    Number(monthlyRevenue) || 0,
    Number(monthlyCosts) || 0,
    Number(period) || 12
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Business ROI Calculator</h1>
        <p>Enter your numbers and see results instantly</p>
      </header>

      <main className="app-layout">
        <aside className="left-column">
          <InputForm values={values} onChange={setValues} />
        </aside>

        <section className="right-column">
          <Results result={result} period={Number(period)} />
          <CashFlowChart data={result.cashFlowData} />
        </section>
      </main>
    </div>
  );
}
