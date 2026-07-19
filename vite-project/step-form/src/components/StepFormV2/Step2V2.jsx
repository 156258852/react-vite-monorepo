import { useFormContext } from 'react-hook-form';
import { useStepNav } from './stepNavContext';
import FormItem from '../StepForm/FormItem';

/**
 * Step2V2 - 联系信息
 * 演示：深层嵌套路径 step2.address.xxx，errors 用 errors.step2?.address?.xxx 访问
 */
const Step2V2 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const { goToStep, goPrev } = useStepNav();

  // 下一步：handleSubmit 校验当前 step，onValid 拿到 data（可调 API / 动态选目标步）
  const handleNext = handleSubmit(
    data => {
      console.log('step2 校验通过，data:', data.step2);
      goToStep(3);
    },
    () => {}
  );

  return (
    <div className="step-content">
      <h2>联系信息（嵌套路径 step2.*）</h2>

      <div className="form-grid">
        <FormItem label="邮箱" required error={errors.step2?.email}>
          <input
            type="email"
            {...register('step2.email', {
              required: '请输入邮箱',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '请输入有效的邮箱地址',
              },
            })}
            className={errors.step2?.email ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="手机号" required error={errors.step2?.phone}>
          <input
            type="tel"
            {...register('step2.phone', {
              required: '请输入电话号码',
              pattern: {
                value: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号码',
              },
            })}
            className={errors.step2?.phone ? 'error' : ''}
          />
        </FormItem>

        {/* 嵌套字段：step2.address.street */}
        <FormItem
          label="街道地址"
          required
          error={errors.step2?.address?.street}
        >
          <input
            type="text"
            {...register('step2.address.street', {
              required: '请输入街道地址',
              minLength: { value: 5, message: '街道地址至少5个字符' },
            })}
            className={errors.step2?.address?.street ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="城市" required error={errors.step2?.address?.city}>
          <input
            type="text"
            {...register('step2.address.city', {
              required: '请输入城市',
            })}
            className={errors.step2?.address?.city ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="省份" required error={errors.step2?.address?.province}>
          <input
            type="text"
            {...register('step2.address.province', {
              required: '请输入省份',
            })}
            className={errors.step2?.address?.province ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="邮政编码" error={errors.step2?.address?.zipCode}>
          <input
            type="text"
            {...register('step2.address.zipCode', {
              pattern: {
                value: /^\d{6}$/,
                message: '请输入6位数字邮编',
              },
            })}
            className={errors.step2?.address?.zipCode ? 'error' : ''}
          />
        </FormItem>
      </div>

      {/* 上一步 + 下一步 */}
      <div className="step-form-actions">
        <button type="button" onClick={goPrev} className="btn btn-secondary">
          上一步
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          下一步
        </button>
      </div>
    </div>
  );
};

export default Step2V2;
