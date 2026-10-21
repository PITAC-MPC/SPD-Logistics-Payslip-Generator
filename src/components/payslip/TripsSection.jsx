import SectionHeading from '../ui/SectionHeading';
import Summary from './Summary';
import TripRow from './TripRow';

export default function TripsSection({
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
    <section className="payslip-section">
      <SectionHeading
        eyebrow="Earnings"
        title="Trips"
        action={
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onAdd}
          >
            <i className="bi bi-plus-lg me-1" aria-hidden="true" />
            Add Trip
          </button>
        }
      />

      <div className="table-responsive payslip-table-wrap">
        <table className="table payslip-table align-middle mb-0">
          <colgroup>
            <col className="col-index" />
            <col />
            <col className="col-trips" />
            <col className="col-rate" />
            <col className="col-amount" />
            <col className="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="row-number">
                #
              </th>
              <th scope="col">Location</th>
              <th scope="col" className="numeric-cell text-end">
                Trips
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
                  No trips yet. Add a trip to get started.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <TripRow
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
        inputId="trip-deduction"
        total={total}
        deduction={deduction}
        deductions={deductions}
        net={net}
        onDeductionUpdate={onDeductionUpdate}
        onAddDeduction={onAddDeduction}
        onRemoveDeduction={onRemoveDeduction}
      />
    </section>
  );
}
