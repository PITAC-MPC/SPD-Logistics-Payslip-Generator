import NumericInput from '../ui/NumericInput';

export default function DeductionRow({
  section,
  row,
  index,
  onUpdate,
  onRemove,
}) {
  const rowNumber = `D${index + 1}`;

  return (
    <tr
      data-nav-row
      data-nav-section={section}
      data-row-type="deduction"
      data-row-id={row.id}
    >
      <td className="row-number deduction-number">{rowNumber}</td>
      <td>
        <input
          type="text"
          data-nav
          className="form-control form-control-sm table-input"
          value={row.reason ?? ''}
          onChange={(event) => onUpdate(row.id, 'reason', event.target.value)}
          placeholder="Deduction reason"
          aria-label={`Deduction reason ${rowNumber}`}
          autoComplete="off"
          maxLength={80}
        />
      </td>
      <td className="numeric-cell">
        <NumericInput
          data-nav
          value={row.amount}
          onValueChange={(value) => onUpdate(row.id, 'amount', value)}
          className="form-control-sm table-input text-end"
          placeholder="0.00"
          aria-label={`Deduction amount ${rowNumber}`}
        />
      </td>
      <td className="row-action no-print">
        <button
          type="button"
          className="btn btn-sm btn-link row-remove"
          onClick={() => onRemove(row.id)}
          aria-label={`Remove deduction ${rowNumber}`}
          title="Remove deduction"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
