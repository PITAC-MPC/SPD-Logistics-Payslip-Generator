export default function PayslipHeader({ meta, onChange }) {
  return (
    <div className="row g-3 payslip-meta">
      <div className="col-12 col-md-4">
        <label className="form-label field-label" htmlFor="payslip-name">
          Name
        </label>
        <input
          id="payslip-name"
          type="text"
          className="form-control meta-input"
          value={meta.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="Driver name"
          autoComplete="off"
        />
      </div>

      <div className="col-6 col-md-3">
        <label
          className="form-label field-label"
          htmlFor="payslip-vehicle-type"
        >
          Vehicle Type
        </label>
        <input
          id="payslip-vehicle-type"
          type="text"
          className="form-control meta-input"
          value={meta.vehicleType}
          onChange={(event) => onChange('vehicleType', event.target.value)}
          placeholder="Vehicle type"
          autoComplete="off"
        />
      </div>

      <div className="col-6 col-md-2">
        <label className="form-label field-label" htmlFor="payslip-plate-no">
          Plate No.
        </label>
        <input
          id="payslip-plate-no"
          type="text"
          className="form-control meta-input"
          value={meta.plateNo}
          onChange={(event) => onChange('plateNo', event.target.value)}
          placeholder="Plate no."
          autoComplete="off"
        />
      </div>

      <div className="col-12 col-md-3">
        <label className="form-label field-label" htmlFor="payslip-date">
          Date
        </label>
        <input
          id="payslip-date"
          type="date"
          className="form-control meta-input"
          value={meta.date}
          onChange={(event) => onChange('date', event.target.value)}
        />
      </div>
    </div>
  );
}
