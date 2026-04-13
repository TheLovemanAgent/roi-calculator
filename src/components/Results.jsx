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

export default function Results({ result, period }) {
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
