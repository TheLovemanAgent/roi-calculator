import { formatCurrency, formatPercent } from '../utils/calculations';

function buildSummary(roi, paybackPeriod, totalNetProfit, period) {
  const periodLabel = period === 12 ? '1 year' : period === 24 ? '2 years' : '3 years';
  const profitLabel = totalNetProfit >= 0
    ? `earn ${formatCurrency(totalNetProfit)} in profit`
    : `lose ${formatCurrency(Math.abs(totalNetProfit))}`;

  if (paybackPeriod === null) {
    return `With these numbers, your costs exceed your revenue, so this investment would not pay itself back within ${periodLabel}.`;
  }

  if (paybackPeriod > period) {
    return `Your investment won't fully pay back within ${periodLabel} — you'd need at least ${paybackPeriod} months to break even.`;
  }

  return `You'll break even in ${paybackPeriod} month${paybackPeriod === 1 ? '' : 's'} and ${profitLabel} over ${periodLabel}. That's a ${formatPercent(roi)} return on your investment.`;
}

function ScenarioMetrics({ result, period, color, label }) {
  const { roi, paybackPeriod, totalNetProfit, monthlyNetProfit } = result;
  const isPositive = totalNetProfit >= 0;

  return (
    <div className="scenario-col">
      <div className="scenario-header">
        <span className="scenario-dot" style={{ background: color }} />
        <span className="scenario-label">{label}</span>
      </div>
      <p className="summary">{buildSummary(roi, paybackPeriod, totalNetProfit, period)}</p>
      <div className="metrics">
        <div className="metric">
          <span className="metric-label">ROI</span>
          <span className={`metric-value ${isPositive ? 'positive' : 'negative'}`}>
            {formatPercent(roi)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Payback Period</span>
          <span className="metric-value">
            {paybackPeriod === null ? 'Never' : `${paybackPeriod} months`}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Total Net Profit</span>
          <span className={`metric-value ${isPositive ? 'positive' : 'negative'}`}>
            {formatCurrency(totalNetProfit)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Monthly Net Profit</span>
          <span className={`metric-value ${monthlyNetProfit >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(monthlyNetProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Results({ result, period, result2, period2 }) {
  const isComparison = !!result2;

  if (isComparison) {
    return (
      <div className="card">
        <h2 className="card-title">Results — Comparison</h2>
        <div className="comparison-results">
          <ScenarioMetrics result={result} period={period} color="#3399ff" label="Scenario 1" />
          <ScenarioMetrics result={result2} period={period2} color="#f59e0b" label="Scenario 2" />
        </div>
      </div>
    );
  }

  const { roi, paybackPeriod, totalNetProfit, monthlyNetProfit } = result;
  const isPositive = totalNetProfit >= 0;

  return (
    <div className="card">
      <h2 className="card-title">Results</h2>
      <p className="summary">{buildSummary(roi, paybackPeriod, totalNetProfit, period)}</p>
      <div className="metrics">
        <div className="metric">
          <span className="metric-label">ROI</span>
          <span className={`metric-value ${isPositive ? 'positive' : 'negative'}`}>
            {formatPercent(roi)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Payback Period</span>
          <span className="metric-value">
            {paybackPeriod === null ? 'Never' : `${paybackPeriod} months`}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Total Net Profit</span>
          <span className={`metric-value ${isPositive ? 'positive' : 'negative'}`}>
            {formatCurrency(totalNetProfit)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Monthly Net Profit</span>
          <span className={`metric-value ${monthlyNetProfit >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(monthlyNetProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
