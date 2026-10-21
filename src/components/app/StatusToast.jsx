export default function StatusToast({ status, onClose }) {
  if (!status) return null;

  const variant = status.variant || 'primary';

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3 no-print">
      <div
        className={`toast show align-items-center text-bg-${variant} border-0 shadow`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{status.message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
            aria-label="Close notification"
          />
        </div>
      </div>
    </div>
  );
}
