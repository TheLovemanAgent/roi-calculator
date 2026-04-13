import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';

function formatYAxis(value) {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const formatted = '$' + Math.round(value).toLocaleString('en-US');
  return (
    <div className="chart-tooltip">
      <p className="tooltip-month">Month {label}</p>
      <p className={value >= 0 ? 'tooltip-positive' : 'tooltip-negative'}>
        {formatted}
      </p>
    </div>
  );
}

export default function CashFlowChart({ data }) {
  return (
    <div className="card chart-card">
      <h2 className="card-title">Cumulative Cash Flow</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e2e8" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 12 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#b0b8c8" strokeDasharray="5 5" label={{ value: 'Break-even', position: 'right', fontSize: 11, fill: '#5a6070' }} />
          <Line
            type="monotone"
            dataKey="cashFlow"
            stroke="#3399ff"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#3399ff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
