import FormItem from './FormItem';
import { useReduxStepForm } from '../../hooks/useReduxStepForm';

const validators = {
  province: (value) => {
    if (!value) return '请输入省份';
    return null;
  },
  city: (value) => {
    if (!value) return '请输入城市';
    return null;
  },
  street: (value) => {
    if (!value) return '请输入街道地址';
    return null;
  },
  zipCode: (value) => {
    if (value && !/^\d{6}$/.test(value)) {
      return '请输入6位数字邮编';
    }
    return null;
  },
};

const Step2 = () => {
  const { stepData, errors, handleChange, goToNext, goToPrev } = useReduxStepForm(
    2,
    validators
  );

  return (
    <div className="step-content">
      <h2>地址信息</h2>

      <div className="form-grid">
        <FormItem label="省份" required error={errors.province}>
          <input
            type="text"
            value={stepData.province || ''}
            onChange={handleChange('province')}
            className={errors.province ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="城市" required error={errors.city}>
          <input
            type="text"
            value={stepData.city || ''}
            onChange={handleChange('city')}
            className={errors.city ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="街道地址" required error={errors.street}>
          <input
            type="text"
            value={stepData.street || ''}
            onChange={handleChange('street')}
            className={errors.street ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="邮政编码" error={errors.zipCode}>
          <input
            type="text"
            value={stepData.zipCode || ''}
            onChange={handleChange('zipCode')}
            className={errors.zipCode ? 'error' : ''}
          />
        </FormItem>
      </div>

      <div className="redux-debug-panel">
        <strong>当前 Redux 数据：</strong>
        <pre>{JSON.stringify(stepData, null, 2)}</pre>
      </div>

      <div className="step-form-actions">
        <button className="btn btn-secondary" onClick={goToPrev}>
          上一步
        </button>
        <button className="btn btn-primary" onClick={goToNext}>
          下一步
        </button>
      </div>
    </div>
  );
};

export default Step2;