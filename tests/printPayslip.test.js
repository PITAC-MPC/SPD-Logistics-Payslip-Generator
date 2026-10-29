import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { computePayslip } from '../src/lib/calculations';
import PrintPayslip from '../src/print/PrintPayslip';

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

function renderPrint(state) {
  return renderToStaticMarkup(
    createElement(PrintPayslip, {
      meta: state.meta,
      totals: computePayslip(state),
      deductions: state.deductions,
      helperDeductions: state.helperDeductions,
    }),
  );
}

describe('print helper section', () => {
  it('hides the helper section when there are no helpers', () => {
    const markup = renderPrint(makeState());

    expect(markup).not.toContain('print-helpers');
    expect(markup).not.toContain('Helpers');
  });

  it('hides the helper section when helper rows are empty', () => {
    const markup = renderPrint(
      makeState({
        helpers: [
          { id: 'h1', name: 'Juan', number: '1', rate: '' },
          { id: 'h2', name: '', number: '', rate: '   ' },
        ],
      }),
    );

    expect(markup).not.toContain('print-helpers');
    expect(markup).not.toContain('Helpers');
  });

  it('hides the helper section even when helper deductions exist', () => {
    const markup = renderPrint(
      makeState({
        helperDeductions: [{ id: 'hd1', reason: 'Cash advance', amount: '50' }],
      }),
    );

    expect(markup).not.toContain('print-helpers');
    expect(markup).not.toContain('Helpers');
  });

  it('shows the helper section when at least one helper has a rate', () => {
    const markup = renderPrint(
      makeState({
        helpers: [{ id: 'h1', name: 'Juan', number: '1', rate: '200' }],
      }),
    );
    const helperSection = markup.slice(markup.indexOf('print-helpers'));

    expect(markup).toContain('print-helpers');
    expect(helperSection).not.toContain('print-section-heading');
    expect(helperSection).not.toContain('Helpers');
    expect(helperSection).toContain('<thead');
    expect(helperSection).toContain('<th scope="col">Helper</th>');
    expect(helperSection).toContain('>Number<');
    expect(helperSection).toContain('>Amount<');
    expect(markup).toContain('Juan');
  });
});

describe('print deductions', () => {
  it('places the deduction total below the listed deductions', () => {
    const markup = renderPrint(
      makeState({
        deductions: [
          { id: 'd1', reason: 'Fuel', amount: '100' },
          { id: 'd2', reason: 'Toll', amount: '50' },
        ],
      }),
    );
    const totalIndex = markup.indexOf('print-summary-deductions-total');

    expect(markup).toContain(
      '<div class="print-summary-deductions-head"><span>Deductions</span></div>',
    );
    expect(markup.indexOf('>Fuel<')).toBeLessThan(totalIndex);
    expect(markup.indexOf('>Toll<')).toBeLessThan(totalIndex);
    expect(markup.slice(totalIndex)).toContain(
      '<span>Total</span><span>₱150.00</span>',
    );
  });
});

describe('print headings', () => {
  it('uses Trips instead of Quantity', () => {
    const markup = renderPrint(makeState());

    expect(markup).toContain('>Trips<');
    expect(markup).not.toContain('Quantity');
  });
});
