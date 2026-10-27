import { describe, expect, it } from 'vitest';
import { computePayslip } from '../src/lib/calculations';
import {
  buildPdfFileName,
  formatDateLong,
  formatPeso,
  round2,
  sanitizeDecimalString,
  sanitizeIntegerString,
  toNumber,
} from '../src/lib/format';

function makeState(overrides = {}) {
  return {
    meta: {
      name: '',
      vehicleType: '',
      plateNo: '',
      date: '2026-10-20',
    },
    descriptions: [],
    deductions: [],
    helpers: [],
    helperDeductions: [],
    ...overrides,
  };
}

describe('description calculations', () => {
  it('multiplies trips by rate and totals the rows', () => {
    const result = computePayslip(
      makeState({
        descriptions: [
          { trips: '2', rate: '150' },
          { trips: '3', rate: '100.50' },
        ],
      }),
    );

    expect(result.descriptionRows.map((row) => row.amount)).toEqual([
      300, 301.5,
    ]);
    expect(result.descriptionTotal).toBe(601.5);
  });

  it('supports the legacy quantity field', () => {
    const result = computePayslip(
      makeState({
        descriptions: [{ quantity: '3', rate: '100' }],
      }),
    );

    expect(result.descriptionRows[0].amount).toBe(300);
  });

  it('subtracts the deduction rows from the description total', () => {
    const result = computePayslip(
      makeState({
        descriptions: [{ trips: '4', rate: '125' }],
        deductions: [{ id: 'd1', reason: 'Fuel advance', amount: '100.50' }],
      }),
    );

    expect(result.descriptionTotal).toBe(500);
    expect(result.descriptionDeduction).toBe(100.5);
    expect(result.descriptionNet).toBe(399.5);
  });

  it('sums multiple description deductions', () => {
    const result = computePayslip(
      makeState({
        descriptions: [{ trips: '2', rate: '500' }],
        deductions: [
          { id: 'd1', reason: 'Fuel advance', amount: '100' },
          { id: 'd2', reason: 'Cash advance', amount: '75.25' },
        ],
      }),
    );

    expect(result.descriptionDeduction).toBe(175.25);
    expect(result.descriptionNet).toBe(824.75);
  });

  it('allows a negative net when the deduction is larger than the total', () => {
    const result = computePayslip(
      makeState({
        descriptions: [{ trips: '1', rate: '100' }],
        deductions: [{ id: 'd1', reason: 'Advance', amount: '150' }],
      }),
    );

    expect(result.descriptionNet).toBe(-50);
  });
});

describe('helper calculations', () => {
  it('multiplies headcount by rate and totals the rows', () => {
    const result = computePayslip(
      makeState({
        helpers: [
          { name: 'Helper', number: '2', rate: '250' },
          { name: 'Helper', number: '1', rate: '100.25' },
        ],
      }),
    );

    expect(result.helperRows.map((row) => row.amount)).toEqual([500, 100.25]);
    expect(result.helperTotal).toBe(600.25);
  });

  it('keeps the helper net separate from the description net', () => {
    const result = computePayslip(
      makeState({
        descriptions: [{ description: 'Route A', trips: '2', rate: '500' }],
        deductions: [{ id: 'd1', reason: 'Fuel', amount: '100' }],
        helpers: [{ name: 'Helper', number: '1', rate: '200' }],
        helperDeductions: [{ id: 'h1', reason: 'Advance', amount: '25' }],
      }),
    );

    expect(result.descriptionNet).toBe(900);
    expect(result.helperNet).toBe(175);
  });

  it('applies the helper deduction rows independently', () => {
    const result = computePayslip(
      makeState({
        helpers: [{ name: 'Helper', number: '3', rate: '80' }],
        helperDeductions: [
          { id: 'h1', reason: 'Advance', amount: '25' },
          { id: 'h2', reason: 'Uniform', amount: '15' },
        ],
      }),
    );

    expect(result.helperTotal).toBe(240);
    expect(result.helperNet).toBe(200);
  });
});

describe('blank and numeric input handling', () => {
  it('treats blank values as zero', () => {
    const result = computePayslip(
      makeState({
        descriptions: [{ description: '', trips: '', rate: '' }],
        deductions: [{ id: 'd1', reason: '', amount: '' }],
        helpers: [{ name: 'Helper', number: '', rate: '' }],
        helperDeductions: [{ id: 'h1', reason: '', amount: '' }],
      }),
    );

    expect(result.descriptionTotal).toBe(0);
    expect(result.descriptionNet).toBe(0);
    expect(result.helperTotal).toBe(0);
    expect(result.helperNet).toBe(0);
  });

  it('handles a missing state safely', () => {
    const result = computePayslip();

    expect(result.descriptionTotal).toBe(0);
    expect(result.helperTotal).toBe(0);
  });

  it('rounds money to two decimals', () => {
    expect(round2(0.1 + 0.2)).toBe(0.3);
    expect(round2(10.005)).toBe(10.01);
    expect(toNumber('1,250.50')).toBe(1250.5);
    expect(toNumber('not a number')).toBe(0);
  });
});

describe('input sanitizers', () => {
  it('keeps only whole numbers for quantities and headcount', () => {
    expect(sanitizeIntegerString('12a3.4')).toBe('1234');
    expect(sanitizeIntegerString('-5')).toBe('5');
  });

  it('keeps at most one decimal point and two decimal places', () => {
    expect(sanitizeDecimalString('₱1,234.567')).toBe('1234.56');
    expect(sanitizeDecimalString('12.3.4')).toBe('12.34');
    expect(sanitizeDecimalString('.5')).toBe('0.5');
    expect(sanitizeDecimalString('abc')).toBe('');
  });
});

describe('formatting and PDF naming', () => {
  it('formats amounts as Philippine pesos', () => {
    expect(formatPeso(1234.5)).toContain('1,234.50');
    expect(formatPeso('150')).toContain('150.00');
    expect(formatPeso(0)).toContain('0.00');
  });

  it('formats ISO dates for print', () => {
    expect(formatDateLong('2026-10-20')).toBe('October 20, 2026');
    expect(formatDateLong('')).toBe('');
  });

  it('builds a safe default PDF filename', () => {
    expect(buildPdfFileName('Juan Dela Cruz', '2026-10-20')).toBe(
      'Payslip - Juan Dela Cruz - 2026-10-20.pdf',
    );
    expect(buildPdfFileName('Juan/Cruz: #1', '2026-10-20')).toBe(
      'Payslip - JuanCruz #1 - 2026-10-20.pdf',
    );
    expect(buildPdfFileName('', '2026-10-20')).toBe('Payslip - 2026-10-20.pdf');
  });
});
