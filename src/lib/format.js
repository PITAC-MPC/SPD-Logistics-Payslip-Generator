const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const longDateFormatter = new Intl.DateTimeFormat('en-PH', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function formatPeso(value) {
  return pesoFormatter.format(toNumber(value));
}

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;

  const number =
    typeof value === 'number'
      ? value
      : Number(String(value).replace(/,/g, '').trim());

  return Number.isFinite(number) ? number : 0;
}

export function round2(value) {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
}

export function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatDateLong(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateString || ''))) return '';

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return '';
  }

  return longDateFormatter.format(date);
}

export function sanitizeIntegerString(value) {
  return String(value ?? '').replace(/\D+/g, '');
}

export function sanitizeDecimalString(value) {
  const cleaned = String(value ?? '').replace(/[^\d.]/g, '');

  if (!cleaned) return '';

  const [whole, ...decimalParts] = cleaned.split('.');
  const normalizedWhole = whole.replace(/^0+(?=\d)/, '');

  if (decimalParts.length === 0) {
    return normalizedWhole;
  }

  const decimals = decimalParts.join('').slice(0, 2);
  return `${normalizedWhole || '0'}.${decimals}`;
}

export function buildPdfFileName(name, dateString) {
  const safeName = String(name ?? '')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

  const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(String(dateString || ''))
    ? dateString
    : todayISO();

  return `Payslip${safeName ? ` - ${safeName}` : ''} - ${safeDate}.pdf`;
}
