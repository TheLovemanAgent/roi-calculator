import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';

function formatYAxis(value) {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label, showComparison }) {
  if (!active || !payload?.length) return null;

  const byKey = {};
  payload.forEach(p => { byKey[p.dataKey] = p.value; });

  return (
    <div className="chart-tooltip">
      <p className="tooltip-month">Month {label}</p>
      {byKey.cashFlow !== undefined && (
        <p className={byKey.cashFlow >= 0 ? 'tooltip-positive' : 'tooltip-negative'}>
          {showComparison && <span className="tooltip-label">S1 </span>}
          {'$' + Math.round(byKey.cashFlow).toLocaleString('en-US')}
        </p>
      )}
      {byKey.cashFlow2 !== undefined && (
        <p className={byKey.cashFlow2 >= 0 ? 'tooltip-positive2' : 'tooltip-negative2'}>
          <span className="tooltip-label">S2 </span>
          {'$' + Math.round(byKey.cashFlow2).toLocaleString('en-US')}
        </p>
      )}
    </div>
  );
}

function renderLegend() {
  return (
    <div className="chart-legend">
      <span className="legend-item">
        <span className="legend-dot" style={{ background: '#3399ff' }} />
        Scenario 1
      </span>
      <span className="legend-item">
        <span className="legend-dot" style={{ background: '#f59e0b' }} />
        Scenario 2
      </span>
    </div>
  );
}

export default function CashFlowChart({ data, showComparison }) {
  return (
    <div className="card chart-card">
      <h2 className="card-title">Cumulative Cash Flow</h2>
      <ResponsiveContainer width="100%" height={showComparison ? 300 : 280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: showComparison ? 30 : 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e2e8" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={60} />
          <Tooltip content={<CustomTooltip showComparison={showComparison} />} />
          <ReferenceLine y={0} stroke="#b0b8c8" strokeDasharray="5 5" label={{ value: 'Break-even', position: 'right', fontSize: 11, fill: '#5a6070' }} />
          <Line
            type="monotone"
            dataKey="cashFlow"
            stroke="#3399ff"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#3399ff' }}
            name="Scenario 1"
          />
          {showComparison && (
            <Line
              type="monotone"
              dataKey="cashFlow2"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#f59e0b' }}
              name="Scenario 2"
              connectNulls={false}
            />
          )}
          {showComparison && <Legend content={renderLegend} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
