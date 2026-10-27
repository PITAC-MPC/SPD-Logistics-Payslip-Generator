import SectionHeading from '../ui/SectionHeading';
import DeductionsTable from './DeductionsTable';
import HelperRow from './HelperRow';
import SectionTotalRow from './SectionTotalRow';

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
          <div
            className="section-actions"
            data-nav-row
            data-nav-section="helpers"
            data-row-type="actions"
          >
            <button
              type="button"
              data-nav
              data-add-row-type="main"
              className="btn btn-outline-primary btn-sm"
              onClick={onAdd}
            >
              <i className="bi bi-plus-lg me-1" aria-hidden="true" />
              Add Helper
            </button>
            <button
              type="button"
              data-nav
              data-add-row-type="deduction"
              className="btn btn-outline-secondary btn-sm"
              onClick={onAddDeduction}
            >
              <i className="bi bi-dash-lg me-1" aria-hidden="true" />
              Add Deduction
            </button>
          </div>
        }
      />

      <div className="payslip-table-wrap">
        <div className="table-responsive">
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
                <th scope="col" className="numeric-cell text-end">
                  Number
                </th>
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
      </div>

      <SectionTotalRow label="Total Helpers Amount" amount={total} />

      <DeductionsTable
        section="helpers"
        rows={deductions}
        onUpdate={onDeductionUpdate}
        onRemove={onRemoveDeduction}
      />

      <SectionTotalRow label="Total Deductions" amount={deduction} prefix="−" />

      <SectionTotalRow
        label="Total"
        amount={net}
        variant="net"
        isNegative={net < 0}
      />
    </section>
  );
}
