export default function PrintFooter() {
  return (
    <footer className="print-footer">
      <div className="received-by">
        <span className="received-label">Prepared By:</span>
        <span className="signature-line" aria-hidden="true" />
      </div>
      <div className="received-by">
        <span className="received-label">Received by:</span>
        <span className="signature-line" aria-hidden="true" />
      </div>
    </footer>
  );
}
