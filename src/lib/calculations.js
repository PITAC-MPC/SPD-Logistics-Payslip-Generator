import { round2, toNumber } from './format';

export function computeDescriptionRows(descriptions = []) {
  return descriptions.map((row) => ({
    ...row,
    amount: round2(toNumber(row.trips ?? row.quantity) * toNumber(row.rate)),
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
  const descriptionRows = computeDescriptionRows(
    state?.descriptions ?? state?.trips,
  );
  const helperRows = computeHelperRows(state?.helpers);

  const descriptionTotal = sumAmounts(descriptionRows);
  const descriptionDeduction = deductionTotal(
    state?.deductions,
    state?.deduction,
  );
  const descriptionNet = round2(descriptionTotal - descriptionDeduction);

  const helperTotal = sumAmounts(helperRows);
  const helperDeduction = deductionTotal(
    state?.helperDeductions,
    state?.helperDeduction,
  );
  const helperNet = round2(helperTotal - helperDeduction);

  return {
    descriptionRows,
    descriptionTotal,
    descriptionDeduction,
    descriptionNet,
    helperRows,
    helperTotal,
    helperDeduction,
    helperNet,
  };
}
