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

const DEFAULT_VALUES_2 = {
  initialInvestment: 50000,
  monthlyRevenue: 12000,
  monthlyCosts: 4000,
  period: 24,
};

function mergeChartData(data1, data2) {
  const maxMonths = Math.max(data1.length, data2.length);
  return Array.from({ length: maxMonths }, (_, i) => {
    const month = i + 1;
    const entry = { month };
    if (i < data1.length) entry.cashFlow = data1[i].cashFlow;
    if (i < data2.length) entry.cashFlow2 = data2[i].cashFlow;
    return entry;
  });
}

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [values2, setValues2] = useState(DEFAULT_VALUES_2);
  const [showComparison, setShowComparison] = useState(false);

  const { initialInvestment, monthlyRevenue, monthlyCosts, period } = values;
  const result = calculate(
    Number(initialInvestment) || 0,
    Number(monthlyRevenue) || 0,
    Number(monthlyCosts) || 0,
    Number(period) || 12
  );

  const result2 = showComparison
    ? calculate(
        Number(values2.initialInvestment) || 0,
        Number(values2.monthlyRevenue) || 0,
        Number(values2.monthlyCosts) || 0,
        Number(values2.period) || 12
      )
    : null;

  const chartData = showComparison
    ? mergeChartData(result.cashFlowData, result2.cashFlowData)
    : result.cashFlowData;

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-logo">
          <span className="nav-logo-mark">EPAM</span>
          <span className="nav-logo-separator" />
          <span className="nav-logo-label">ROI Calculator</span>
        </div>
      </nav>

      <header className="app-header">
        <div className="app-header-inner">
          <h1>Business <span>ROI</span> Calculator</h1>
          <p>Enter your numbers and see results instantly</p>
        </div>
      </header>
      <div className="accent-bar" />

      <main className="app-layout">
        <aside className="left-column">
          <InputForm
            title="Scenario 1"
            color="#3399ff"
            values={values}
            onChange={setValues}
          />

          {!showComparison && (
            <button
              className="add-scenario-btn"
              onClick={() => setShowComparison(true)}
            >
              + Add Scenario
            </button>
          )}

          {showComparison && (
            <InputForm
              title="Scenario 2"
              color="#f59e0b"
              values={values2}
              onChange={setValues2}
              onRemove={() => setShowComparison(false)}
            />
          )}
        </aside>

        <section className="right-column">
          <Results
            result={result}
            period={Number(period)}
            result2={result2}
            period2={Number(values2.period)}
          />
          <CashFlowChart data={chartData} showComparison={showComparison} />
        </section>
      </main>
    </div>
  );
}
