// 公共 FormItem 组件
const FormItem = ({ label, required, children, error, fullWidth }) => {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      <label>
        {label} {required && '*'}
      </label>
      {children}
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default FormItem;
