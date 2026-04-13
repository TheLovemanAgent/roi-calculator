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

export function formatCurrency(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

export function formatPercent(value) {
  return value.toFixed(1) + '%';
}
