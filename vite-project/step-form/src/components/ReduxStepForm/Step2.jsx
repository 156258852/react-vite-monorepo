import FormItem from './FormItem';
import { useFormContext } from '../../hooks';

const Step2 = () => {
  const { stepData, stepErrors, fieldProps, goToNext, goToPrev } =
    useFormContext();

  return (
    <div className="step-content">
      <h2>地址信息</h2>

      <div className="form-grid">
        <FormItem label="省份" required error={stepErrors.province}>
          <input
            type="text"
            {...fieldProps('province', {
              rules: value => {
                if (!value) return '请输入省份';
              },
            })}
          />
        </FormItem>

        <FormItem label="城市" required error={stepErrors.city}>
          <input
            type="text"
            {...fieldProps('city', {
              rules: value => {
                if (!value) return '请输入城市';
              },
            })}
          />
        </FormItem>

        <FormItem label="街道地址" required error={stepErrors.street}>
          <input
            type="text"
            {...fieldProps('street', {
              rules: value => {
                if (!value) return '请输入街道地址';
              },
            })}
          />
        </FormItem>

        <FormItem label="邮政编码" error={stepErrors.zipCode}>
          <input
            type="text"
            {...fieldProps('zipCode', {
              rules: value => {
                if (value && !/^\d{6}$/.test(value)) {
                  return '请输入6位数字邮编';
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

export default Step2;
