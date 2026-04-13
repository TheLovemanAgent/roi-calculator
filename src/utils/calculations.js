export function calculate(initialInvestment, monthlyRevenue, monthlyCosts, period) {
  const monthlyNetProfit = monthlyRevenue - monthlyCosts;
  const totalNetProfit = monthlyNetProfit * period - initialInvestment;
  const roi = initialInvestment > 0 ? (totalNetProfit / initialInvestment) * 100 : 0;

  let paybackPeriod;
  if (monthlyNetProfit <= 0) {
    paybackPeriod = null; // "Never"
  } else {
    paybackPeriod = Math.ceil(initialInvestment / monthlyNetProfit);
  }

  const cashFlowData = [];
  for (let month = 1; month <= period; month++) {
    cashFlowData.push({
      month,
      cashFlow: monthlyNetProfit * month - initialInvestment,
    });
  }

  return { monthlyNetProfit, totalNetProfit, roi, paybackPeriod, cashFlowData };
}

export function validate(values) {
  const errors = {};
  const investment = Number(values.initialInvestment);
  const revenue = Number(values.monthlyRevenue);
  const costs = Number(values.monthlyCosts);

  if (values.initialInvestment === '' || values.initialInvestment === undefined) {
    errors.initialInvestment = 'Initial investment is required';
  } else if (isNaN(investment) || investment < 0) {
    errors.initialInvestment = 'Must be a positive number';
  } else if (investment < 100) {
    errors.initialInvestment = 'Minimum investment is $100';
  }

  if (values.monthlyRevenue === '' || values.monthlyRevenue === undefined) {
    errors.monthlyRevenue = 'Monthly revenue is required';
  } else if (isNaN(revenue) || revenue <= 0) {
    errors.monthlyRevenue = 'Revenue must be greater than $0';
  }

  if (values.monthlyCosts === '' || values.monthlyCosts === undefined) {
    errors.monthlyCosts = 'Monthly costs are required';
  } else if (isNaN(costs) || costs < 0) {
    errors.monthlyCosts = 'Must be zero or a positive number';
  }

  return errors;
}

export function formatCurrency(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

export function formatPercent(value) {
  return value.toFixed(1) + '%';
}
