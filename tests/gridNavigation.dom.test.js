// @vitest-environment jsdom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;

function keydown(target, key, options = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });

  target.dispatchEvent(event);

  return event;
}

function tripRows() {
  return container.querySelectorAll(
    'tr[data-nav-section="trips"][data-row-type="main"]',
  );
}

async function flushAnimationFrame() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
}

function tripActionButtons() {
  return container.querySelectorAll(
    '[data-nav-section="trips"][data-row-type="actions"] button[data-nav]',
  );
}

function appBarButtons() {
  return container.querySelectorAll(
    '[data-nav-section="appbar"] button[data-nav]',
  );
}

function headerInputs() {
  return container.querySelectorAll(
    '[data-nav-section="header"] input[data-nav]',
  );
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

describe('header and app bar in the keyboard grid', () => {
  it('navigates only Print and Save in the app bar', () => {
    const [printButton, saveButton] = appBarButtons();

    expect(appBarButtons().length).toBe(2);
    expect(printButton.textContent.trim()).toBe('Print');
    expect(saveButton.textContent.trim()).toBe('Save as PDF');

    act(() => {
      printButton.focus();
    });

    act(() => {
      keydown(printButton, 'ArrowRight');
    });

    expect(document.activeElement).toBe(saveButton);

    act(() => {
      const event = keydown(saveButton, 'ArrowRight');
      expect(event.defaultPrevented).toBe(false);
    });

    expect(document.activeElement).toBe(saveButton);
  });

  it('flows between Print, Save and the header fields', () => {
    const [printButton, saveButton] = appBarButtons();
    const [name, vehicleType, plateNo, date] = headerInputs();

    act(() => {
      printButton.focus();
    });

    act(() => {
      keydown(printButton, 'ArrowDown');
    });

    expect(document.activeElement).toBe(name);

    act(() => {
      keydown(name, 'ArrowRight');
    });

    expect(document.activeElement).toBe(vehicleType);

    act(() => {
      keydown(vehicleType, 'ArrowUp');
    });

    expect(document.activeElement).toBe(saveButton);

    act(() => {
      keydown(saveButton, 'ArrowDown');
    });

    expect(document.activeElement).toBe(vehicleType);

    act(() => {
      keydown(vehicleType, 'ArrowRight');
    });

    expect(document.activeElement).toBe(plateNo);

    act(() => {
      keydown(plateNo, 'ArrowRight');
    });

    expect(document.activeElement).toBe(date);

    const [, addDeductionButton] = tripActionButtons();

    act(() => {
      keydown(date, 'ArrowDown');
    });

    expect(document.activeElement).toBe(addDeductionButton);
  });

  it('returns from the header to the app bar with ArrowUp', () => {
    const [printButton] = appBarButtons();
    const [name] = headerInputs();

    act(() => {
      name.focus();
    });

    act(() => {
      keydown(name, 'ArrowUp');
    });

    expect(document.activeElement).toBe(printButton);
  });

  it('activates Print with Enter', () => {
    const [printButton] = appBarButtons();

    act(() => {
      printButton.focus();
    });

    act(() => {
      keydown(printButton, 'Enter');
    });

    expect(container.textContent).toContain(
      'Printing is only available in the desktop app.',
    );
  });

  it('does not remove rows with Ctrl+Delete in the header', () => {
    const [name] = headerInputs();
    const before = tripRows().length;

    act(() => {
      name.focus();
    });

    act(() => {
      keydown(name, 'Delete', { ctrlKey: true });
    });

    expect(tripRows().length).toBe(before);
  });
});

describe('section action buttons in the keyboard grid', () => {
  it('reaches the action buttons with ArrowUp from the first trip row', () => {
    const firstCell = tripRows()[0].querySelector('input[data-nav]');
    const [addTripButton] = tripActionButtons();

    act(() => {
      firstCell.focus();
    });

    act(() => {
      keydown(firstCell, 'ArrowUp');
    });

    expect(document.activeElement).toBe(addTripButton);
  });

  it('moves between the action buttons with ArrowLeft/ArrowRight', () => {
    const [addTripButton, addDeductionButton] = tripActionButtons();

    act(() => {
      addTripButton.focus();
    });

    act(() => {
      keydown(addTripButton, 'ArrowRight');
    });

    expect(document.activeElement).toBe(addDeductionButton);

    act(() => {
      keydown(addDeductionButton, 'ArrowLeft');
    });

    expect(document.activeElement).toBe(addTripButton);
  });

  it('returns to the first trip row with ArrowDown', () => {
    const [addTripButton] = tripActionButtons();
    const firstCell = tripRows()[0].querySelector('input[data-nav]');

    act(() => {
      addTripButton.focus();
    });

    act(() => {
      keydown(addTripButton, 'ArrowDown');
    });

    expect(document.activeElement).toBe(firstCell);
  });

  it('adds a trip and focuses it when Enter is pressed on Add Trip', async () => {
    const [addTripButton] = tripActionButtons();
    const before = tripRows().length;

    act(() => {
      addTripButton.focus();
    });

    act(() => {
      keydown(addTripButton, 'Enter');
    });

    await flushAnimationFrame();

    const rows = tripRows();

    expect(rows.length).toBe(before + 1);
    expect(document.activeElement).toBe(
      rows[rows.length - 1].querySelector('input[data-nav]'),
    );
  });

  it('adds a deduction and focuses it when Enter is pressed on Add Deduction', async () => {
    const [, addDeductionButton] = tripActionButtons();
    const deductionRows = () =>
      container.querySelectorAll(
        'tr[data-nav-section="trips"][data-row-type="deduction"]',
      );
    const before = deductionRows().length;

    act(() => {
      addDeductionButton.focus();
    });

    act(() => {
      keydown(addDeductionButton, 'Enter');
    });

    await flushAnimationFrame();

    const rows = deductionRows();

    expect(rows.length).toBe(before + 1);
    expect(document.activeElement).toBe(
      rows[rows.length - 1].querySelector('input[data-nav]'),
    );
  });
});
