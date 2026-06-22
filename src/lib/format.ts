export function formatMoney(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return 'Narx belgilanmagan';
  }

  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0
  }).format(Number(value));
}
