import { formatCurrency } from '../utils/calculations';

export default function MonthlyTable({ cashFlowData, monthlyRevenue, monthlyCosts, title, color }) {
  const monthlyNetProfit = monthlyRevenue - monthlyCosts;

  // First month where cumulative cash flow turns non-negative
  const breakevenMonth = cashFlowData.find(d => d.cashFlow >= 0)?.month ?? null;

  return (
    <div className="card table-card">
      {title && (
        <div className="table-scenario-header">
          <span className="scenario-dot" style={{ background: color }} />
          <span className="scenario-label">{title}</span>
        </div>
      )}
      <div className="table-wrapper">
        <table className="monthly-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Monthly Revenue</th>
              <th>Monthly Costs</th>
              <th>Net Profit</th>
              <th>Cumulative Cash Flow</th>
            </tr>
          </thead>
          <tbody>
            {cashFlowData.map(({ month, cashFlow }) => {
              const isBreakeven = month === breakevenMonth;
              return (
                <tr
                  key={month}
                  className={[
                    month % 2 === 0 ? 'row-even' : 'row-odd',
                    isBreakeven ? 'row-breakeven' : '',
                  ].join(' ')}
                >
                  <td className="col-month">
                    {month}
                    {isBreakeven && <span className="breakeven-badge">Break-even</span>}
                  </td>
                  <td>{formatCurrency(monthlyRevenue)}</td>
                  <td>{formatCurrency(monthlyCosts)}</td>
                  <td className={monthlyNetProfit >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(monthlyNetProfit)}
                  </td>
                  <td className={cashFlow >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(cashFlow)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
