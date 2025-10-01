export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
}) {
  return (
    <label className="form-group">
      <span className="form-label">{label}</span>
      <textarea
        className="form-input"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
      />
    </label>
  );
}
