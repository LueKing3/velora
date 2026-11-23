const currencyConfig = {
  INR: { symbol: '₹', locale: 'en-IN', code: 'INR' },
  USD: { symbol: '$', locale: 'en-US', code: 'USD' },
  EUR: { symbol: '€', locale: 'en-DE', code: 'EUR' },
  GBP: { symbol: '£', locale: 'en-GB', code: 'GBP' },
};

export const formatCurrency = (amount, currencyCode = 'INR') => {
  const config = currencyConfig[currencyCode] || currencyConfig.INR;
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return config.symbol + Math.abs(amount).toLocaleString(config.locale);
  }
};

export const formatCompact = (amount, currencyCode = 'INR') => {
  const config = currencyConfig[currencyCode] || currencyConfig.INR;
  if (currencyCode === 'INR') {
    if (amount >= 10000000) return config.symbol + (amount / 10000000).toFixed(1) + 'Cr';
    if (amount >= 100000) return config.symbol + (amount / 100000).toFixed(1) + 'L';
    if (amount >= 1000) return config.symbol + (amount / 1000).toFixed(1) + 'K';
    return config.symbol + amount;
  }
  if (amount >= 1000000) return config.symbol + (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return config.symbol + (amount / 1000).toFixed(1) + 'K';
  return config.symbol + amount;
};

export const supportedCurrencies = Object.keys(currencyConfig);
export { currencyConfig };
