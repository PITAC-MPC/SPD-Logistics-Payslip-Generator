import { formatPeso } from '../../lib/format';
import NumericInput from '../ui/NumericInput';

export default function DescriptionRow({ row, index, onUpdate, onRemove }) {
  const isEmpty = !row.description.trim() && !row.trips && !row.rate;

  return (
    <tr
      className={isEmpty ? 'payslip-row-empty' : undefined}
      data-nav-row
      data-nav-section="descriptions"
      data-row-type="main"
      data-row-id={row.id}
    >
      <td className="row-number">{index + 1}</td>

      <td>
        <input
          type="text"
          data-nav
          className="form-control form-control-sm table-input"
          value={row.description}
          onChange={(event) => onUpdate('description', event.target.value)}
          placeholder="Enter description"
          aria-label={`Description for row ${index + 1}`}
          autoComplete="off"
        />
      </td>

      <td className="numeric-cell">
        <NumericInput
          data-nav
          integer
          value={row.trips}
          onValueChange={(value) => onUpdate('trips', value)}
          className="form-control-sm table-input text-end"
          placeholder="0"
          aria-label={`Trips for row ${index + 1}`}
        />
      </td>

      <td className="numeric-cell">
        <NumericInput
          data-nav
          value={row.rate}
          onValueChange={(value) => onUpdate('rate', value)}
          className="form-control-sm table-input text-end"
          placeholder="0.00"
          aria-label={`Rate for row ${index + 1}`}
        />
      </td>

      <td className="amount-cell text-end">{formatPeso(row.amount)}</td>

      <td className="row-action no-print">
        <button
          type="button"
          className="btn btn-sm btn-link row-remove"
          onClick={onRemove}
          aria-label={`Remove row ${index + 1}`}
          title="Remove row"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
