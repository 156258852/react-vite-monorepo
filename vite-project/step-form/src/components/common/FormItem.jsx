const FormItem = ({ label, required, children, error, fullWidth }) => {
  const errorMessage = error?.message || error;
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label>
        {label} {required && '*'}
      </label>
      {children}
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default FormItem;
