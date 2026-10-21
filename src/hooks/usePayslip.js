import { useEffect, useState } from 'react';
import {
  sanitizeDecimalString,
  sanitizeIntegerString,
  todayISO,
} from '../lib/format';

const STORAGE_KEY = 'pitac-payslip-draft-v1';
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function makeId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createTrip() {
  return {
    id: makeId(),
    location: '',
    trips: '',
    rate: '',
  };
}

function createHelper() {
  return {
    id: makeId(),
    name: 'Helper',
    number: '1',
    rate: '',
  };
}

function createDeduction() {
  return {
    id: makeId(),
    reason: '',
    amount: '',
  };
}

export function createEmptyState() {
  return {
    meta: {
      name: '',
      vehicleType: '',
      plateNo: '',
      date: todayISO(),
    },
    trips: Array.from({ length: 5 }, createTrip),
    deductions: [createDeduction()],
    helpers: [createHelper()],
    helperDeductions: [createDeduction()],
  };
}

function normalizeTrip(row) {
  return {
    id: typeof row?.id === 'string' && row.id ? row.id : makeId(),
    location: String(row?.location ?? ''),
    trips: sanitizeIntegerString(row?.trips ?? ''),
    rate: sanitizeDecimalString(row?.rate ?? ''),
  };
}

function normalizeHelper(row) {
  return {
    id: typeof row?.id === 'string' && row.id ? row.id : makeId(),
    name: String(row?.name ?? 'Helper'),
    number: sanitizeIntegerString(row?.number ?? '1'),
    rate: sanitizeDecimalString(row?.rate ?? ''),
  };
}

function normalizeDeduction(row) {
  return {
    id: typeof row?.id === 'string' && row.id ? row.id : makeId(),
    reason: String(row?.reason ?? '').slice(0, 80),
    amount: sanitizeDecimalString(row?.amount ?? ''),
  };
}

function normalizeDeductions(rows, legacyAmount, legacyReason) {
  if (Array.isArray(rows)) return rows.map(normalizeDeduction);

  const amount = sanitizeDecimalString(legacyAmount ?? '');
  const reason = String(legacyReason ?? '').slice(0, 80);

  if (amount || reason) {
    return [{ id: makeId(), reason, amount }];
  }

  return [createDeduction()];
}

function applyDeductionUpdate(rows, id, field, value) {
  return rows.map((row) => {
    if (row.id !== id) return row;

    if (field === 'amount') {
      return { ...row, amount: sanitizeDecimalString(value) };
    }

    if (field === 'reason') {
      return { ...row, reason: String(value ?? '').slice(0, 80) };
    }

    return row;
  });
}

function loadDraft() {
  const fallback = createEmptyState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    const meta = parsed?.meta ?? {};
    const storedDate =
      typeof meta.date === 'string' && ISO_DATE_PATTERN.test(meta.date)
        ? meta.date
        : fallback.meta.date;

    return {
      meta: {
        name: String(meta.name ?? ''),
        vehicleType: String(meta.vehicleType ?? ''),
        plateNo: String(meta.plateNo ?? ''),
        date: storedDate,
      },
      trips: Array.isArray(parsed?.trips)
        ? parsed.trips.map(normalizeTrip)
        : fallback.trips,
      deductions: normalizeDeductions(
        parsed?.deductions,
        parsed?.deduction,
        parsed?.deductionReason,
      ),
      helpers: Array.isArray(parsed?.helpers)
        ? parsed.helpers.map(normalizeHelper)
        : fallback.helpers,
      helperDeductions: normalizeDeductions(
        parsed?.helperDeductions,
        parsed?.helperDeduction,
        parsed?.helperDeductionReason,
      ),
    };
  } catch {
    return fallback;
  }
}

export default function usePayslip() {
  const [state, setState] = useState(loadDraft);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // A failed draft save should never interrupt data entry.
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [state]);

  const updateMeta = (field, value) => {
    if (!['name', 'vehicleType', 'plateNo', 'date'].includes(field)) return;

    setState((current) => ({
      ...current,
      meta: {
        ...current.meta,
        [field]: String(value ?? ''),
      },
    }));
  };

  const updateTrip = (id, field, value) => {
    setState((current) => ({
      ...current,
      trips: current.trips.map((row) => {
        if (row.id !== id) return row;

        if (field === 'trips') {
          return { ...row, trips: sanitizeIntegerString(value) };
        }

        if (field === 'rate') {
          return { ...row, rate: sanitizeDecimalString(value) };
        }

        if (field === 'location') {
          return { ...row, location: String(value ?? '') };
        }

        return row;
      }),
    }));
  };

  const addTrip = () => {
    setState((current) => ({
      ...current,
      trips: [...current.trips, createTrip()],
    }));
  };

  const removeTrip = (id) => {
    setState((current) => ({
      ...current,
      trips: current.trips.filter((row) => row.id !== id),
    }));
  };

  const updateDeduction = (id, field, value) => {
    setState((current) => ({
      ...current,
      deductions: applyDeductionUpdate(current.deductions, id, field, value),
    }));
  };

  const addDeduction = () => {
    setState((current) => ({
      ...current,
      deductions: [...current.deductions, createDeduction()],
    }));
  };

  const removeDeduction = (id) => {
    setState((current) => ({
      ...current,
      deductions: current.deductions.filter((row) => row.id !== id),
    }));
  };

  const updateHelper = (id, field, value) => {
    setState((current) => ({
      ...current,
      helpers: current.helpers.map((row) => {
        if (row.id !== id) return row;

        if (field === 'number') {
          return { ...row, number: sanitizeIntegerString(value) };
        }

        if (field === 'rate') {
          return { ...row, rate: sanitizeDecimalString(value) };
        }

        if (field === 'name') {
          return { ...row, name: String(value ?? '') };
        }

        return row;
      }),
    }));
  };

  const addHelper = () => {
    setState((current) => ({
      ...current,
      helpers: [...current.helpers, createHelper()],
    }));
  };

  const removeHelper = (id) => {
    setState((current) => ({
      ...current,
      helpers: current.helpers.filter((row) => row.id !== id),
    }));
  };

  const updateHelperDeduction = (id, field, value) => {
    setState((current) => ({
      ...current,
      helperDeductions: applyDeductionUpdate(
        current.helperDeductions,
        id,
        field,
        value,
      ),
    }));
  };

  const addHelperDeduction = () => {
    setState((current) => ({
      ...current,
      helperDeductions: [...current.helperDeductions, createDeduction()],
    }));
  };

  const removeHelperDeduction = (id) => {
    setState((current) => ({
      ...current,
      helperDeductions: current.helperDeductions.filter((row) => row.id !== id),
    }));
  };

  const reset = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures; the in-memory reset still applies.
    }

    setState(createEmptyState());
  };

  return {
    state,
    updateMeta,
    updateTrip,
    addTrip,
    removeTrip,
    updateDeduction,
    addDeduction,
    removeDeduction,
    updateHelper,
    addHelper,
    removeHelper,
    updateHelperDeduction,
    addHelperDeduction,
    removeHelperDeduction,
    reset,
  };
}
