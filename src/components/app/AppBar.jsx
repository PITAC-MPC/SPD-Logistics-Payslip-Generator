export default function AppBar({ onNew, onPrint, onSavePdf, savingPdf }) {
  return (
    <header className="app-bar no-print">
      <div className="container-xxl app-bar-inner">
        <div className="app-brand">
          <span className="app-brand-icon" aria-hidden="true">
            <i className="bi bi-truck" />
          </span>
          <span className="app-brand-copy">
            <span className="app-brand-title">
              PITAC-MPC Special Project Division
            </span>
          </span>
        </div>

        <div className="app-actions">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onNew}
          >
            <i className="bi bi-file-earmark-plus me-1" aria-hidden="true" />
            New Payslip
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onPrint}
            disabled
          >
            <i className="bi bi-printer me-1" aria-hidden="true" />
            Print
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onSavePdf}
            disabled={savingPdf}
          >
            {savingPdf ? (
              <span
                className="spinner-border spinner-border-sm me-1"
                aria-hidden="true"
              />
            ) : (
              <i className="bi bi-file-earmark-pdf me-1" aria-hidden="true" />
            )}
            {savingPdf ? 'Saving...' : 'Save as PDF'}
          </button>
        </div>
      </div>
    </header>
  );
}
