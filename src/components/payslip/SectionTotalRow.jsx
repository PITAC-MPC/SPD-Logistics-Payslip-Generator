import { formatPeso } from '../../lib/format';

export default function SectionTotalRow({
  label,
  amount,
  variant,
  isNegative = false,
  prefix = '',
}) {
  const classes = [
    'section-total-row',
    variant ? `section-total-${variant}` : '',
    isNegative ? 'is-negative' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className="section-total-label">{label}</span>
      <span className="section-total-value">
        {prefix}
        {formatPeso(amount)}
      </span>
    </div>
  );
}
