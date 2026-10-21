import { formatPeso } from '../../lib/format';
import NumericInput from '../ui/NumericInput';

export default function TripRow({ row, index, onUpdate, onRemove }) {
  const isEmpty = !row.location.trim() && !row.trips && !row.rate;

  return (
    <tr className={isEmpty ? 'payslip-row-empty' : undefined}>
      <td className="row-number">{index + 1}</td>

      <td>
        <input
          type="text"
          className="form-control form-control-sm table-input"
          value={row.location}
          onChange={(event) => onUpdate('location', event.target.value)}
          placeholder="Enter location"
          aria-label={`Location for trip ${index + 1}`}
          autoComplete="off"
        />
      </td>

      <td className="numeric-cell">
        <NumericInput
          integer
          value={row.trips}
          onValueChange={(value) => onUpdate('trips', value)}
          className="form-control-sm table-input text-end"
          placeholder="0"
          aria-label={`Number of trips for trip ${index + 1}`}
        />
      </td>

      <td className="numeric-cell">
        <NumericInput
          value={row.rate}
          onValueChange={(value) => onUpdate('rate', value)}
          className="form-control-sm table-input text-end"
          placeholder="0.00"
          aria-label={`Rate for trip ${index + 1}`}
        />
      </td>

      <td className="amount-cell text-end">{formatPeso(row.amount)}</td>

      <td className="row-action no-print">
        <button
          type="button"
          className="btn btn-sm btn-link row-remove"
          onClick={onRemove}
          aria-label={`Remove trip ${index + 1}`}
          title="Remove row"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
