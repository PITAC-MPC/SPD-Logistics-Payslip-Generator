// @vitest-environment jsdom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem(
    'pitac-payslip-draft-v1',
    JSON.stringify({
      meta: {
        name: 'Old Draft',
        vehicleType: 'Truck',
        plateNo: 'ABC 123',
        date: '2026-10-20',
      },
      trips: [
        { id: 't1', location: 'Old route', trips: '3', rate: '100' },
        { id: 't2', location: '', trips: '', rate: '' },
      ],
      deductions: [{ id: 'd1', reason: 'Fuel', amount: '50' }],
      helpers: [{ id: 'h1', name: 'Helper', number: '1', rate: '200' }],
      helperDeductions: [],
    }),
  );

  Element.prototype.scrollIntoView = () => {};

  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => {
    root.render(createElement(App));
  });
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

describe('draft migration', () => {
  it('loads legacy trip rows as descriptions with quantities', () => {
    const descriptionRows = container.querySelectorAll(
      'tr[data-nav-section="descriptions"][data-row-type="main"]',
    );
    const firstRow = descriptionRows[0];
    const [descriptionInput, quantityInput, rateInput] =
      firstRow.querySelectorAll('input[data-nav]');

    expect(descriptionInput.value).toBe('Old route');
    expect(quantityInput.value).toBe('3');
    expect(rateInput.value).toBe('100');
    expect(container.textContent).toContain('Total Amount');
    expect(container.textContent).toContain('300.00');
  });
});
