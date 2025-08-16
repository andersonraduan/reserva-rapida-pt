export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove currency symbols and parse
  const cleanValue = value.replace(/[€\s]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};