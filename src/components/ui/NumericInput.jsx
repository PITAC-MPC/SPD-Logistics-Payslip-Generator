import { sanitizeDecimalString, sanitizeIntegerString } from '../../lib/format';

export default function NumericInput({
  value,
  onValueChange,
  integer = false,
  className = '',
  ...props
}) {
  const handleChange = (event) => {
    const nextValue = integer
      ? sanitizeIntegerString(event.target.value)
      : sanitizeDecimalString(event.target.value);

    onValueChange(nextValue);
  };

  return (
    <input
      {...props}
      type="text"
      inputMode={integer ? 'numeric' : 'decimal'}
      autoComplete="off"
      spellCheck={false}
      className={`form-control ${className}`.trim()}
      value={value ?? ''}
      onChange={handleChange}
    />
  );
}
