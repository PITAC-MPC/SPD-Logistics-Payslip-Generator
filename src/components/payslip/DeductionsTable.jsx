import DeductionRow from './DeductionRow';

export default function DeductionsTable({ section, rows, onUpdate, onRemove }) {
  return (
    <div className="payslip-table-wrap deductions-block">
      <div className="deductions-heading">Deductions</div>

      <div className="table-responsive">
        <table className="table payslip-table deductions-table align-middle mb-0">
          <colgroup>
            <col className="col-index" />
            <col />
            <col className="col-amount" />
            <col className="col-action" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="row-number">
                D#
              </th>
              <th scope="col">Reason</th>
              <th scope="col" className="numeric-cell text-end">
                Amount
              </th>
              <th scope="col" className="row-action no-print" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  No deductions yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <DeductionRow
                  key={row.id}
                  section={section}
                  row={row}
                  index={index}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
