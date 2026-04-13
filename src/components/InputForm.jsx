export default function InputForm({ title, color, values, onChange, onRemove }) {
  function handle(field, raw) {
    const num = raw === '' ? '' : Number(raw);
    onChange({ ...values, [field]: num });
  }

  return (
    <div className="card">
      <div className="card-title-row">
        <h2 className="card-title">
          {title && (
            <span className="scenario-dot" style={{ background: color }} />
          )}
          {title ? `${title} — Parameters` : 'Investment Parameters'}
        </h2>
        {onRemove && (
          <button className="remove-scenario-btn" onClick={onRemove} title="Remove scenario">
            ✕
          </button>
        )}
      </div>

      <div className="field">
        <label htmlFor={`initialInvestment-${title}`}>Initial Investment ($)</label>
        <input
          id={`initialInvestment-${title}`}
          type="number"
          min="0"
          value={values.initialInvestment}
          onChange={e => handle('initialInvestment', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor={`monthlyRevenue-${title}`}>Expected Monthly Revenue ($)</label>
        <input
          id={`monthlyRevenue-${title}`}
          type="number"
          min="0"
          value={values.monthlyRevenue}
          onChange={e => handle('monthlyRevenue', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor={`monthlyCosts-${title}`}>Monthly Operating Costs ($)</label>
        <input
          id={`monthlyCosts-${title}`}
          type="number"
          min="0"
          value={values.monthlyCosts}
          onChange={e => handle('monthlyCosts', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor={`period-${title}`}>Calculation Period (months)</label>
        <select
          id={`period-${title}`}
          value={values.period}
          onChange={e => handle('period', e.target.value)}
        >
          <option value={12}>12 months (1 year)</option>
          <option value={24}>24 months (2 years)</option>
          <option value={36}>36 months (3 years)</option>
        </select>
      </div>
    </div>
  );
}
