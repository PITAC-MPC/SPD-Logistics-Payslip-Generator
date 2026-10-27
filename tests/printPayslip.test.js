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

    expect(markup).toContain('print-helpers');
    expect(markup).toContain('Helpers');
    expect(markup).toContain('Juan');
  });
});
