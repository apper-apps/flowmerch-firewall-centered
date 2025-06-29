const Input = ({ 
  label, 
  error, 
  hint,
  type = 'text',
  className = '',
  labelClassName = '',
  required = false,
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`form-field w-full ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  )
}

export default Input