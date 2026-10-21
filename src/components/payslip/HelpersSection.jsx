import SectionHeading from '../ui/SectionHeading';
import HelperRow from './HelperRow';
import Summary from './Summary';

export default function HelpersSection({
  rows,
  total,
  deduction,
  deductions,
  net,
  onUpdate,
  onAdd,
  onRemove,
  onDeductionUpdate,
  onAddDeduction,
  onRemoveDeduction,
}) {
  return (
    <section className="payslip-section helpers-section">
      <SectionHeading
        eyebrow="Payouts"
        title="Helpers"
        action={
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onAdd}
          >
            <i className="bi bi-plus-lg me-1" aria-hidden="true" />
            Add Helper
          </button>
        }
      />

      <div className="table-responsive payslip-table-wrap">
        <table className="table payslip-table helpers-table align-middle mb-0">
          <colgroup>
            <col className="col-index" />
            <col />
            <col className="col-helpers-number" />
            <col className="col-helpers-rate" />
            <col className="col-helpers-amount" />
            <col className="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="row-number">
                #
              </th>
              <th scope="col">Helper</th>
              <th scope="col" className="numeric-cell text-end"></th>
              <th scope="col" className="numeric-cell text-end">
                Rate (&#8369;)
              </th>
              <th scope="col" className="amount-cell text-end">
                Amount
              </th>
              <th scope="col" className="row-action no-print" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No helpers yet. Add a helper row to get started.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <HelperRow
                  key={row.id}
                  row={row}
                  index={index}
                  onUpdate={(field, value) => onUpdate(row.id, field, value)}
                  onRemove={() => onRemove(row.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Summary
        inputId="helper-deduction"
        total={total}
        deduction={deduction}
        deductions={deductions}
        net={net}
        onDeductionUpdate={onDeductionUpdate}
        onAddDeduction={onAddDeduction}
        onRemoveDeduction={onRemoveDeduction}
        compact
      />
    </section>
  );
}
