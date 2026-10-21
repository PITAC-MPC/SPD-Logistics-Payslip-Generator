import { formatPeso } from '../../lib/format';
import NumericInput from '../ui/NumericInput';

export default function HelperRow({ row, index, onUpdate, onRemove }) {
  const isEmpty = !row.rate;

  return (
    <tr className={isEmpty ? 'payslip-row-empty' : undefined}>
      <td className="row-number">{index + 1}</td>

      <td>
        <input
          type="text"
          className="form-control form-control-sm table-input"
          value={row.name}
          onChange={(event) => onUpdate('name', event.target.value)}
          placeholder="Helper"
          aria-label={`Name of helper ${index + 1}`}
          autoComplete="off"
        />
      </td>

      <td className="numeric-cell">
        <NumericInput
          integer
          value={row.number}
          onValueChange={(value) => onUpdate('number', value)}
          className="form-control-sm table-input text-end"
          placeholder="1"
          aria-label={`Number of helpers for helper row ${index + 1}`}
        />
      </td>

      <td className="numeric-cell">
        <NumericInput
          value={row.rate}
          onValueChange={(value) => onUpdate('rate', value)}
          className="form-control-sm table-input text-end"
          placeholder="0.00"
          aria-label={`Rate for helper row ${index + 1}`}
        />
      </td>

      <td className="amount-cell text-end">{formatPeso(row.amount)}</td>

      <td className="row-action no-print">
        <button
          type="button"
          className="btn btn-sm btn-link row-remove"
          onClick={onRemove}
          aria-label={`Remove helper row ${index + 1}`}
          title="Remove row"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
