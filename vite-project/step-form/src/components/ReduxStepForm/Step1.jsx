import FormItem from './FormItem';
import { useFormContext } from '../../hooks';

const Step1 = () => {
  const { stepData, stepErrors, fieldProps, goToNext, goToPrev } =
    useFormContext();

  return (
    <div className="step-content">
      <h2>联系方式</h2>

      <div className="form-grid">
        <FormItem label="邮箱" required error={stepErrors.email}>
          <input
            type="email"
            {...fieldProps('email', {
              rules: value => {
                if (!value) return '请输入邮箱';
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return '请输入有效的邮箱地址';
                }
              },
            })}
          />
        </FormItem>

        <FormItem label="手机号" required error={stepErrors.phone}>
          <input
            type="tel"
            {...fieldProps('phone', {
              rules: value => {
                if (!value) return '请输入手机号';
                if (!/^1[3-9]\d{9}$/.test(value)) {
                  return '请输入有效的手机号码';
                }
              },
            })}
          />
        </FormItem>
      </div>

      <div className="redux-debug-panel">
        <strong>当前数据：</strong>
        <pre>{JSON.stringify(stepData, null, 2)}</pre>
      </div>

      <div className="step-form-actions">
        <button className="btn btn-secondary" onClick={() => goToPrev()}>
          上一步
        </button>
        <button className="btn btn-primary" onClick={() => goToNext()}>
          下一步
        </button>
      </div>
    </div>
  );
};

export default Step1;
