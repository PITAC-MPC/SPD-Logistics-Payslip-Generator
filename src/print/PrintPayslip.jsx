import PrintFooter from '../components/payslip/PrintFooter';
import { formatDateLong, formatPeso, toNumber } from '../lib/format';

function hasTripContent(row) {
  return Boolean(
    String(row.location ?? '').trim() ||
    String(row.trips ?? '').trim() ||
    String(row.rate ?? '').trim(),
  );
}

function hasHelperContent(row) {
  return Boolean(String(row.rate ?? '').trim());
}

function PrintSummary({
  total,
  deduction,
  deductions = [],
  net,
  compact = false,
}) {
  const deductionRows = deductions.filter(
    (row) => String(row.reason ?? '').trim() || toNumber(row.amount) > 0,
  );

  return (
    <div className={`print-summary${compact ? ' print-summary-compact' : ''}`}>
      <div className="print-summary-row">
        <span>Total</span>
        <span>{formatPeso(total)}</span>
      </div>
      {deductionRows.length ? (
        <>
          <div className="print-summary-deductions-head">
            <span>Deductions</span>
            <span>{formatPeso(deduction)}</span>
          </div>
          {deductionRows.map((row) => (
            <div className="print-summary-deduction-row" key={row.id}>
              <span>{String(row.reason ?? '').trim() || 'Deduction'}</span>
              <span>{formatPeso(row.amount)}</span>
            </div>
          ))}
        </>
      ) : (
        <div className="print-summary-row">
          <span>Deduction</span>
          <span>{formatPeso(deduction)}</span>
        </div>
      )}
      <div className="print-summary-row print-summary-net highlight">
        <span>Net</span>
        <span>{formatPeso(net)}</span>
      </div>
    </div>
  );
}

export default function PrintPayslip({
  meta,
  totals,
  deductions,
  helperDeductions,
}) {
  const trips = (totals?.tripRows ?? []).filter(hasTripContent);
  const helpers = (totals?.helperRows ?? []).filter(hasHelperContent);

  return (
    <article className="print-document">
      <header className="print-header">
        <div>
          <div className="print-kicker">
            San Victores St., Brgy. 9, Malaybalay City
          </div>
          <div className="print-kicker">Special Project Division</div>
          <h1 className="print-title">Pitac Multipurpose Cooperative</h1>
        </div>
        <div className="print-note"></div>
      </header>

      <section className="print-meta">
        <div className="print-meta-item">
          <span className="print-meta-label">Name</span>
          <span className="print-meta-value">{meta.name || '\u00a0'}</span>
        </div>
        <div className="print-meta-item">
          <span className="print-meta-label">Vehicle Type</span>
          <span className="print-meta-value">
            {meta.vehicleType || '\u00a0'}
          </span>
        </div>
        <div className="print-meta-item">
          <span className="print-meta-label">Plate No.</span>
          <span className="print-meta-value">{meta.plateNo || '\u00a0'}</span>
        </div>
        <div className="print-meta-item">
          <span className="print-meta-label">Date</span>
          <span className="print-meta-value">
            {formatDateLong(meta.date) || '\u00a0'}
          </span>
        </div>
      </section>

      <hr className="print-rule" />

      <section className="print-section">
        <div className="print-section-heading">
          <span className="print-section-eyebrow">Earnings</span>
          <h2 className="print-section-title">Trips</h2>
        </div>

        <table className="print-table">
          <colgroup>
            <col className="print-col-index" />
            <col />
            <col className="print-col-trips" />
            <col className="print-col-rate" />
            <col className="print-col-amount" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="print-row-number">
                #
              </th>
              <th scope="col">Location</th>
              <th scope="col" className="print-num">
                Trips
              </th>
              <th scope="col" className="print-num">
                Rate (&#8369;)
              </th>
              <th scope="col" className="print-num">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {trips.map((row, index) => (
              <tr key={row.id}>
                <td className="print-row-number">{index + 1}</td>
                <td>{row.location}</td>
                <td className="print-num">{row.trips}</td>
                <td className="print-num">{row.rate}</td>
                <td className="print-num print-amount">
                  {formatPeso(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PrintSummary
          total={totals?.tripTotal ?? 0}
          deduction={totals?.tripDeduction ?? 0}
          deductions={deductions}
          net={totals?.tripNet ?? 0}
        />
      </section>

      <section className="print-section print-helpers">
        <div className="print-section-heading">
          <span className="print-section-eyebrow">Payouts</span>
          <h2 className="print-section-title">Helpers</h2>
        </div>

        <table className="print-table">
          <colgroup>
            <col className="print-col-index" />
            <col />
            <col className="print-col-trips" />
            <col className="print-col-rate" />
            <col className="print-col-amount" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="print-row-number">
                #
              </th>
              <th scope="col">Helper</th>
              <th scope="col" className="print-num">
                Number
              </th>
              <th scope="col" className="print-num">
                Rate (&#8369;)
              </th>
              <th scope="col" className="print-num">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {helpers.map((row, index) => (
              <tr key={row.id}>
                <td className="print-row-number">{index + 1}</td>
                <td>{row.name}</td>
                <td className="print-num">{row.number}</td>
                <td className="print-num">{row.rate}</td>
                <td className="print-num print-amount">
                  {formatPeso(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PrintSummary
          total={totals?.helperTotal ?? 0}
          deduction={totals?.helperDeduction ?? 0}
          deductions={helperDeductions}
          net={totals?.helperNet ?? 0}
          compact
        />
      </section>

      <PrintFooter />
    </article>
  );
}
