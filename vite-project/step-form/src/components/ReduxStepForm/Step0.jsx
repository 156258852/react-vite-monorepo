import FormItem from './FormItem';
import { useReduxStepForm } from '../../hooks/useReduxStepForm';

const validators = {
  firstName: (value) => {
    if (!value) return '请输入姓名';
    if (value.length < 2) return '姓名至少2个字符';
    return null;
  },
  lastName: (value) => {
    if (!value) return '请输入姓氏';
    return null;
  },
  age: (value) => {
    if (!value) return '请输入年龄';
    if (Number(value) < 18) return '年龄必须大于18岁';
    if (Number(value) > 120) return '年龄不能超过120岁';
    return null;
  },
  gender: (value) => {
    if (!value) return '请选择性别';
    return null;
  },
  genderDescription: (value) => {
    if (!value) return '请输入性别说明';
    return null;
  },
};

const conditionalFields = {
  genderDescription: (data) => data.gender === 'other',
};

const Step0 = () => {
  const { stepData, errors, handleChange, goToNext } = useReduxStepForm(0, validators, {
    conditionalFields,
  });

  return (
    <div className="step-content">
      <h2>个人信息</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Redux 版本：受控组件，验证逻辑在组件内
      </p>

      <div className="form-grid">
        <FormItem label="姓名" required error={errors.firstName}>
          <input
            type="text"
            value={stepData.firstName || ''}
            onChange={handleChange('firstName')}
            className={errors.firstName ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="姓氏" required error={errors.lastName}>
          <input
            type="text"
            value={stepData.lastName || ''}
            onChange={handleChange('lastName')}
            className={errors.lastName ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="年龄" required error={errors.age}>
          <input
            type="number"
            value={stepData.age || ''}
            onChange={handleChange('age')}
            className={errors.age ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="性别" required error={errors.gender}>
          <select
            value={stepData.gender || ''}
            onChange={handleChange('gender')}
            className={errors.gender ? 'error' : ''}
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </FormItem>

        {stepData.gender === 'other' && (
          <FormItem label="性别说明" required error={errors.genderDescription}>
            <input
              type="text"
              value={stepData.genderDescription || ''}
              onChange={handleChange('genderDescription')}
              placeholder="请说明您的性别"
              className={errors.genderDescription ? 'error' : ''}
            />
          </FormItem>
        )}
      </div>

      <div className="redux-debug-panel">
        <strong>当前 Redux 数据：</strong>
        <pre>{JSON.stringify(stepData, null, 2)}</pre>
      </div>

      <div className="step-form-actions">
        <div></div>
        <button className="btn btn-primary" onClick={goToNext}>
          下一步
        </button>
      </div>
    </div>
  );
};

export default Step0;