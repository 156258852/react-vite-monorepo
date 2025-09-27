import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import FormItem from './FormItem';
import { createFormValidateConfig } from './formConfig';

const Step1 = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm(
    createFormValidateConfig({
      defaultValues: {
        firstName: '',
        lastName: '',
        age: '22',
        gender: '',
      },
    })
  );

  // 当默认值改变时，更新表单
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      console.log('执行 了吗');
      // 方法1: 使用 reset 重置整个表单
      reset(defaultValues);

      // 方法2: 使用 setValue 逐个设置字段值
      // Object.keys(defaultValues).forEach(key => {
      //   setValue(key, defaultValues[key]);
      // });
    }
  }, [defaultValues, reset, setValue]);

  // 提供一些实用的表单操作方法（示例）
  // eslint-disable-next-line no-unused-vars
  const formMethods = {
    // 设置单个字段值
    setFieldValue: (fieldName, value) => {
      setValue(fieldName, value, { shouldValidate: true, shouldDirty: true });
    },

    // 获取单个字段值
    getFieldValue: fieldName => {
      return getValues(fieldName);
    },

    // 获取所有字段值
    getAllValues: () => {
      return getValues();
    },

    // 设置多个字段值
    setMultipleValues: values => {
      Object.keys(values).forEach(key => {
        setValue(key, values[key], { shouldValidate: true, shouldDirty: true });
      });
    },

    // 重置表单
    resetForm: values => {
      reset(values);
    },
  };

  // 监听表单值变化（可选）
  // eslint-disable-next-line no-unused-vars
  const watchedValues = watch();

  // 将表单方法暴露给父组件（如果需要的话）
  useEffect(() => {
    if (onSubmit && typeof onSubmit === 'function') {
      // 可以通过某种方式将 formMethods 传递给父组件
      // 例如通过 ref 或者回调
    }
  }, [onSubmit]);

  // 处理表单提交事件
  const handleFormSubmit = data => {
    if (data?.age < 18) {
      alert('请选择18岁以上的会员');
      return;
    }

    onSubmit(data);
  };

  const handleFormError = err => {
    console.log('err', err);
  };

  return (
    <div className="step-content">
      <h2>个人信息</h2>

      {/* 示例按钮：演示如何使用表单方法 */}
      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <p>
          <strong>表单操作示例：</strong>
        </p>
        <div style={{ marginBottom: '10px' }}>
          <button
            type="button"
            onClick={() =>
              setValue('firstName', '张三', { shouldValidate: true })
            }
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            设置姓名为"张三"
          </button>
          <button
            type="button"
            onClick={() => setValue('age', '25', { shouldValidate: true })}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            设置年龄为25
          </button>
          <button
            type="button"
            onClick={() => {
              const currentName = getValues('firstName');
              alert(`当前姓名是: ${currentName || '(空)'}`);
            }}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            获取当前姓名
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() =>
              setValue('customInput', '自定义值测试', { shouldValidate: true })
            }
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            设置自定义输入值
          </button>
          <button
            type="button"
            onClick={() =>
              setValue('prefixedPhone', '13888888888', { shouldValidate: true })
            }
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            设置电话号码
          </button>
          <button
            type="button"
            onClick={() =>
              setValue('customGender', 'female', { shouldValidate: true })
            }
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            设置性别为女性
          </button>
          <button
            type="button"
            onClick={() => {
              const allValues = getValues();
              console.log('所有表单值:', allValues);
              alert('所有表单值已打印到控制台');
            }}
            style={{ padding: '5px 10px' }}
          >
            获取所有值
          </button>
        </div>
      </div>

      <form
        id="step-1-form"
        onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
      >
        <div className="form-grid">
          <FormItem label="姓名" required error={errors.firstName}>
            <input
              type="text"
              {...register('firstName', {
                required: '请输入姓名',
                minLength: { value: 2, message: '姓名至少2个字符' },
              })}
              className={errors.firstName ? 'error' : ''}
            />
          </FormItem>

          <FormItem label="姓氏" required error={errors.lastName}>
            <input
              type="text"
              {...register('lastName', {
                required: '请输入姓氏',
                minLength: { value: 1, message: '姓氏至少1个字符' },
              })}
              className={errors.lastName ? 'error' : ''}
            />
          </FormItem>

          <FormItem label="年龄" required error={errors.age}>
            <input
              type="number"
              {...register('age', {
                required: '请输入年龄',
                min: { value: 1, message: '年龄必须大于0' },
                max: { value: 120, message: '年龄不能超过120' },
              })}
              className={errors.age ? 'error' : ''}
            />
          </FormItem>

          <FormItem label="性别" required error={errors.gender}>
            <select
              {...register('gender', { required: '请选择性别' })}
              className={errors.gender ? 'error' : ''}
            >
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </FormItem>
        </div>
      </form>
    </div>
  );
};

export default Step1;
