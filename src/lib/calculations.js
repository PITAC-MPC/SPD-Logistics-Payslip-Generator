import { round2, toNumber } from './format';

export function computeTripRows(trips = []) {
  return trips.map((row) => ({
    ...row,
    amount: round2(toNumber(row.trips) * toNumber(row.rate)),
  }));
}

export function computeHelperRows(helpers = []) {
  return helpers.map((row) => ({
    ...row,
    amount: round2(toNumber(row.number) * toNumber(row.rate)),
  }));
}

export function sumAmounts(rows = []) {
  return round2(rows.reduce((total, row) => total + toNumber(row.amount), 0));
}

function deductionTotal(rows, legacyAmount) {
  if (Array.isArray(rows)) return sumAmounts(rows);
  return round2(toNumber(legacyAmount));
}

export function computePayslip(state) {
  const tripRows = computeTripRows(state?.trips);
  const helperRows = computeHelperRows(state?.helpers);

  const tripTotal = sumAmounts(tripRows);
  const tripDeduction = deductionTotal(state?.deductions, state?.deduction);
  const tripNet = round2(tripTotal - tripDeduction);

  const helperTotal = sumAmounts(helperRows);
  const helperDeduction = deductionTotal(
    state?.helperDeductions,
    state?.helperDeduction,
  );
  const helperNet = round2(helperTotal - helperDeduction);

  return {
    tripRows,
    tripTotal,
    tripDeduction,
    tripNet,
    helperRows,
    helperTotal,
    helperDeduction,
    helperNet,
  };
}
