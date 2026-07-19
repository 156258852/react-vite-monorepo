import { useFormContext } from 'react-hook-form';
import { useStepNav } from './stepNavContext';
import FormItem from '../StepForm/FormItem';

/**
 * Step0V2 - 兴趣信息
 * 演示：通过 useFormContext 拿到父级的 form 方法，用嵌套路径 step0.xxx 注册字段
 */
const Step0V2 = () => {
  // RHF 原生方法走 useFormContext，自定义导航方法走 useStepNav
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const { goNext, currentStep } = useStepNav();

  // 下一步：handleSubmit 校验当前 step 字段，onValid 拿到 data（可调 API / 动态选目标步）
  const handleNext = handleSubmit(
    data => {
      // ✅ onValid 拿到整个 form 的 data，可以调 API / 动态选目标步
      console.log('step0 校验通过，data:', data[`step${currentStep}`]);
      goNext();
    },
    () => {} // 校验失败 → 留在当前步
  );

  return (
    <div className="step-content">
      <h2>兴趣信息（嵌套路径 step0.*）</h2>

      <div className="form-grid">
        <FormItem label="兴趣爱好" required error={errors.step0?.hobby}>
          <input
            type="text"
            placeholder="例如：阅读、编程"
            {...register('step0.hobby', {
              required: '请输入兴趣爱好',
              minLength: { value: 2, message: '至少2个字符' },
            })}
            className={errors.step0?.hobby ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="熟练程度" required error={errors.step0?.level}>
          <select
            {...register('step0.level', { required: '请选择熟练程度' })}
            className={errors.step0?.level ? 'error' : ''}
          >
            <option value="beginner">初学者</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
            <option value="expert">专家</option>
          </select>
        </FormItem>
      </div>

      {/* 第一步只有「下一步」 */}
      <div className="step-form-actions">
        <button type="button" onClick={handleNext} className="btn btn-primary">
          下一步
        </button>
      </div>
    </div>
  );
};

export default Step0V2;
