// @vitest-environment jsdom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

function setInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  ).set;

  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

beforeEach(() => {
  window.localStorage.clear();
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

describe('input behavior', () => {
  it('starts helper number inputs blank', () => {
    const helperNumber = container.querySelector(
      '[data-nav-section="helpers"][data-row-type="main"] input[aria-label^="Number of helpers"]',
    );

    expect(helperNumber.value).toBe('');
    expect(helperNumber.placeholder).toBe('0');
  });

  it('moves the caret to the end when a text input receives focus', () => {
    const name = container.querySelector('#payslip-name');
    const vehicleType = container.querySelector('#payslip-vehicle-type');

    setInputValue(name, 'car');

    act(() => {
      vehicleType.focus();
    });

    act(() => {
      name.focus();
    });

    expect(name.selectionStart).toBe(3);
    expect(name.selectionEnd).toBe(3);
  });
});
