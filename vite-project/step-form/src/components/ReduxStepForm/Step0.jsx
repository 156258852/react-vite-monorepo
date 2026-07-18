import FormItem from './FormItem';
import { useFormContext } from '../../hooks';

const Step0 = () => {
  const {
    stepErrors,
    fieldProps,
    setFieldValue,
    goToNext,
    watch,
    getValues,
    currentKey,
  } = useFormContext();

  const gender = watch('gender');

  const handleGenderChange = e => {
    const value = e.target.value;
    setFieldValue('gender', value);
    if (value !== 'other') {
      setFieldValue('genderDescription', '');
    }
  };

  return (
    <div className="step-content">
      <h2>个人信息</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Redux 版本：受控组件，验证逻辑在组件内
      </p>

      <div className="form-grid">
        <FormItem label="姓名" required error={stepErrors.firstName}>
          <input
            type="text"
            {...fieldProps('firstName', {
              rules: value => {
                if (!value) return '请输入姓名';
                if (value.length < 2) return '姓名至少2个字符';
              },
            })}
          />
        </FormItem>

        <FormItem label="姓氏" required error={stepErrors.lastName}>
          <input
            type="text"
            {...fieldProps('lastName', {
              rules: value => {
                if (!value) return '请输入姓氏';
              },
            })}
          />
        </FormItem>

        <FormItem label="年龄" required error={stepErrors.age}>
          <input
            type="number"
            {...fieldProps('age', {
              rules: value => {
                if (!value) return '请输入年龄';
                if (Number(value) < 18) return '年龄必须大于18岁';
                if (Number(value) > 120) return '年龄不能超过120岁';
              },
            })}
          />
        </FormItem>

        <FormItem label="性别" required error={stepErrors.gender}>
          <select
            {...fieldProps('gender', {
              rules: value => {
                if (!value) return '请选择性别';
              },
              onChange: handleGenderChange,
            })}
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </FormItem>

        {gender === 'other' && (
          <FormItem
            label="性别说明"
            required
            error={stepErrors.genderDescription}
          >
            <input
              type="text"
              placeholder="请说明您的性别"
              {...fieldProps('genderDescription', {
                rules: value => {
                  if (!value) return '请输入性别说明';
                },
              })}
            />
          </FormItem>
        )}
      </div>

      <div className="redux-debug-panel">
        <strong>当前数据：</strong>
        <pre>{JSON.stringify(getValues()[currentKey], null, 2)}</pre>
      </div>

      <div className="step-form-actions">
        <div></div>
        <button className="btn btn-primary" onClick={() => goToNext()}>
          下一步
        </button>
      </div>
    </div>
  );
};

export default Step0;
