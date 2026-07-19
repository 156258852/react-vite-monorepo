import { useFormContext } from 'react-hook-form';
import { useStepNav } from './stepNavContext';
import FormItem from '../StepForm/FormItem';

/**
 * Step1V2 - 个人信息
 * 演示：嵌套路径 step1.xxx，errors 用 errors.step1?.xxx 访问
 */
const Step1V2 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const { goToStep, goPrev } = useStepNav();

  // 下一步：handleSubmit 校验当前 step，onValid 拿到 data（可调 API / 动态选目标步）
  const handleNext = handleSubmit(
    data => {
      console.log('step1 校验通过，data:', data.step1);
      goToStep(2);
    },
    () => {}
  );

  return (
    <div className="step-content">
      <h2>个人信息（嵌套路径 step1.*）</h2>

      <div className="form-grid">
        <FormItem label="姓名" required error={errors.step1?.firstName}>
          <input
            type="text"
            {...register('step1.firstName', {
              required: '请输入姓名',
              minLength: { value: 2, message: '姓名至少2个字符' },
            })}
            className={errors.step1?.firstName ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="姓氏" required error={errors.step1?.lastName}>
          <input
            type="text"
            {...register('step1.lastName', {
              required: '请输入姓氏',
            })}
            className={errors.step1?.lastName ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="年龄" required error={errors.step1?.age}>
          <input
            type="number"
            {...register('step1.age', {
              required: '请输入年龄',
              min: { value: 18, message: '年龄必须大于等于18岁' },
              max: { value: 120, message: '年龄不能超过120' },
            })}
            className={errors.step1?.age ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="性别" required error={errors.step1?.gender}>
          <select
            {...register('step1.gender', { required: '请选择性别' })}
            className={errors.step1?.gender ? 'error' : ''}
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
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

export default Step1V2;
