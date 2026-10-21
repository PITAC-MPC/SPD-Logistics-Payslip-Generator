import { formatPeso } from '../../lib/format';
import NumericInput from '../ui/NumericInput';

export default function Summary({
  inputId,
  total,
  deduction,
  deductions = [],
  net,
  onDeductionUpdate,
  onAddDeduction,
  onRemoveDeduction,
  compact = false,
}) {
  return (
    <div className={`summary-panel${compact ? ' summary-panel-compact' : ''}`}>
      <div className="summary-row">
        <span className="summary-label">Total</span>
        <span className="summary-value">{formatPeso(total)}</span>
      </div>

      <div className="summary-deductions">
        <div className="summary-deductions-head">
          <span className="summary-label">Deductions</span>
          <span className="summary-deductions-total">
            {formatPeso(deduction)}
          </span>
        </div>

        {deductions.length ? (
          <div className="summary-deduction-list">
            {deductions.map((row, index) => (
              <div className="summary-deduction-item" key={row.id}>
                <input
                  id={`${inputId}-reason-${row.id}`}
                  type="text"
                  className="form-control summary-deduction-reason"
                  value={row.reason ?? ''}
                  onChange={(event) =>
                    onDeductionUpdate(row.id, 'reason', event.target.value)
                  }
                  placeholder={`Reason ${index + 1}`}
                  maxLength={80}
                  aria-label={`Deduction reason ${index + 1}`}
                />
                <div className="summary-deduction-amount">
                  <span className="summary-currency" aria-hidden="true">
                    &#8369;
                  </span>
                  <NumericInput
                    id={`${inputId}-amount-${row.id}`}
                    value={row.amount}
                    onValueChange={(value) =>
                      onDeductionUpdate(row.id, 'amount', value)
                    }
                    className="summary-input text-end"
                    placeholder="0.00"
                    aria-label={`Deduction amount ${index + 1}`}
                  />
                </div>
                <button
                  type="button"
                  className="summary-deduction-remove"
                  onClick={() => onRemoveDeduction(row.id)}
                  aria-label={`Remove deduction ${index + 1}`}
                >
                  <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="summary-deductions-empty">No deductions.</p>
        )}

        <button
          type="button"
          className="summary-deduction-add"
          onClick={onAddDeduction}
        >
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />
          Add deduction
        </button>
      </div>

      <div
        className={`summary-row summary-net-row${net < 0 ? ' is-negative' : ''}`}
      >
        <span className="summary-label">Net</span>
        <span className="summary-value">{formatPeso(net)}</span>
      </div>
    </div>
  );
}
