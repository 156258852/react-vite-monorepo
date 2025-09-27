import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import FormItem from './FormItem';
import { createFormValidateConfig } from './formConfig';

const Step2 = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    // watch
  } = useForm(
    createFormValidateConfig({
      defaultValues: {
        email: '',
        phone: '',
        // 嵌套对象示例
        address: {
          street: '',
          city: '',
          province: '',
          zipCode: '',
        },
        // 另一个嵌套对象
        contact: {
          workPhone: '',
          homePhone: '',
          emergency: {
            name: '',
            phone: '',
          },
        },
      },
    })
  );

  // 当默认值改变时，更新表单
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // 处理表单提交
  const handleFormSubmit = data => {
    onSubmit(data);
  };

  return (
    <div className="step-content">
      <h2>联系信息</h2>

      {/* 嵌套字段操作示例 */}
      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#e8f4fd',
          borderRadius: '4px',
        }}
      >
        <p>
          <strong>嵌套字段操作示例：</strong>
        </p>
        <button
          type="button"
          onClick={() =>
            setValue('address.street', '中山路123号', { shouldValidate: true })
          }
          style={{
            marginRight: '10px',
            padding: '5px 10px',
            marginBottom: '5px',
          }}
        >
          设置街道地址
        </button>
        <button
          type="button"
          onClick={() =>
            setValue('address.city', '深圳', { shouldValidate: true })
          }
          style={{
            marginRight: '10px',
            padding: '5px 10px',
            marginBottom: '5px',
          }}
        >
          设置城市
        </button>
        <button
          type="button"
          onClick={() => {
            const street = getValues('address.street');
            alert(`当前街道: ${street || '(空)'}`);
          }}
          style={{
            marginRight: '10px',
            padding: '5px 10px',
            marginBottom: '5px',
          }}
        >
          获取街道
        </button>
        <br />
        <button
          type="button"
          onClick={() => {
            const fullAddress = getValues('address');
            console.log('完整地址对象:', fullAddress);
            alert('完整地址对象已打印到控制台');
          }}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          获取完整地址对象
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(
              'contact.emergency',
              { name: '李四', phone: '13800138000' },
              { shouldValidate: true }
            );
          }}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          设置紧急联系人
        </button>
        <button
          type="button"
          onClick={() => {
            const emergency = getValues('contact.emergency.name');
            alert(`紧急联系人: ${emergency || '(空)'}`);
          }}
          style={{ padding: '5px 10px' }}
        >
          获取紧急联系人姓名
        </button>
        <button
          type="button"
          onClick={() => {
            const allValues = getValues();
            console.log('所有表单值:', allValues);
          }}
          style={{ padding: '5px 10px' }}
        >
          获取所有字段值
        </button>
      </div>

      <form id="step-2-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-grid">
          <FormItem label="邮箱" required error={errors.email}>
            <input
              type="email"
              {...register('email', {
                required: '请输入邮箱',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '请输入有效的邮箱地址',
                },
              })}
              className={errors.email ? 'error' : ''}
            />
          </FormItem>

          <FormItem label="手机号" required error={errors.phone}>
            <input
              type="tel"
              {...register('phone', {
                required: '请输入电话号码',
                pattern: {
                  value: /^1[3-9]\d{9}$/,
                  message: '请输入有效的手机号码',
                },
              })}
              className={errors.phone ? 'error' : ''}
            />
          </FormItem>

          {/* 嵌套字段：address.street */}
          <FormItem label="街道地址" required error={errors.address?.street}>
            <input
              type="text"
              {...register('address.street', {
                required: '请输入街道地址',
                minLength: {
                  value: 5,
                  message: '街道地址至少5个字符',
                },
              })}
              className={errors.address?.street ? 'error' : ''}
            />
          </FormItem>

          {/* 嵌套字段：address.city */}
          <FormItem label="城市" required error={errors.address?.city}>
            <input
              type="text"
              {...register('address.city', {
                required: '请输入城市',
                minLength: {
                  value: 2,
                  message: '城市名至少2个字符',
                },
              })}
              className={errors.address?.city ? 'error' : ''}
            />
          </FormItem>

          {/* 嵌套字段：address.province */}
          <FormItem label="省份" required error={errors.address?.province}>
            <input
              type="text"
              {...register('address.province', {
                required: '请输入省份',
              })}
              className={errors.address?.province ? 'error' : ''}
            />
          </FormItem>

          {/* 嵌套字段：address.zipCode */}
          <FormItem label="邮政编码" error={errors.address?.zipCode}>
            <input
              type="text"
              {...register('address.zipCode', {
                pattern: {
                  value: /^\d{6}$/,
                  message: '请输入6位数字邮编',
                },
              })}
              className={errors.address?.zipCode ? 'error' : ''}
            />
          </FormItem>

          {/* 深层嵌套字段：contact.emergency.name */}
          <FormItem label="紧急联系人" error={errors.contact?.emergency?.name}>
            <input
              type="text"
              {...register('contact.emergency.name', {
                minLength: {
                  value: 2,
                  message: '姓名至少2个字符',
                },
              })}
              className={errors.contact?.emergency?.name ? 'error' : ''}
            />
          </FormItem>

          {/* 深层嵌套字段：contact.emergency.phone */}
          <FormItem
            label="紧急联系电话"
            error={errors.contact?.emergency?.phone}
          >
            <input
              type="tel"
              {...register('contact.emergency.phone', {
                pattern: {
                  value: /^1[3-9]\d{9}$/,
                  message: '请输入有效的手机号码',
                },
              })}
              className={errors.contact?.emergency?.phone ? 'error' : ''}
            />
          </FormItem>
        </div>
      </form>
    </div>
  );
};

export default Step2;
