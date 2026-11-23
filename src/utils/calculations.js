export const getMonthlyData = (transactions, year, month) => {
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

export const getTotalByType = (transactions, type) => {
  return transactions.filter(t => t.type === type).reduce((sum, t) => sum + t.amount, 0);
};

export const getBalance = (transactions) => {
  return transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
};

export const getMonthlyIncome = (transactions, year, month) => getTotalByType(getMonthlyData(transactions, year, month), 'income');
export const getMonthlyExpenses = (transactions, year, month) => getTotalByType(getMonthlyData(transactions, year, month), 'expense');
export const getMonthlySavings = (transactions, year, month) => getMonthlyIncome(transactions, year, month) - getMonthlyExpenses(transactions, year, month);

export const getSavingsRate = (transactions, year, month) => {
  const income = getMonthlyIncome(transactions, year, month);
  if (income === 0) return 0;
  return Math.round(((income - getMonthlyExpenses(transactions, year, month)) / income) * 100);
};

export const getPercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const getCategoryBreakdown = (transactions, type = 'expense') => {
  const filtered = transactions.filter(t => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  const grouped = {};
  filtered.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = 0;
    grouped[t.category] += t.amount;
  });
  return Object.entries(grouped).map(([category, amount]) => ({
    category, amount,
    percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
  })).sort((a, b) => b.amount - a.amount);
};

export const getMonthlyTrend = (transactions, numMonths = 6) => {
  const now = new Date();
  const months = [];
  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    months.push({
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      fullMonth: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      income: getMonthlyIncome(transactions, year, month),
      expenses: getMonthlyExpenses(transactions, year, month),
      savings: getMonthlyIncome(transactions, year, month) - getMonthlyExpenses(transactions, year, month),
    });
  }
  return months;
};

export const getSpentInCategory = (transactions, categoryId, year, month) => {
  return getMonthlyData(transactions, year, month)
    .filter(t => t.type === 'expense' && t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
};
