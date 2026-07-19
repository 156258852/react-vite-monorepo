import { useFormContext } from 'react-hook-form';
import { useStepNav } from './stepNavContext';
import FormItem from '../StepForm/FormItem';

/**
 * Step3V2 - 确认信息
 * 演示单 Form 架构的核心优势：
 * 1. 通过 watch() 直接读取其他 step 的数据，无需 props 传递
 * 2. 本步骤自身字段用 step3.xxx 注册
 */
const Step3V2 = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { goPrev } = useStepNav();

  // 直接监听整个表单，跨 step 读数据 —— 这是单 Form 架构的最大好处
  const formData = watch();

  return (
    <div className="step-content">
      <h2>确认信息（跨 step 读取数据）</h2>

      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          border: '1px solid #2196f3',
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
          📊 实时表单数据（watch 整个 form）
        </h4>
        <pre
          style={{
            margin: 0,
            fontSize: '12px',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px',
          }}
        >
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>

      {/* 跨 step 数据汇总展示 —— 无需任何 props */}
      <div className="confirmation-section">
        <h3>个人信息（来自 step1）</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>姓名:</strong> {formData.step1?.firstName || '未填写'}{' '}
            {formData.step1?.lastName || ''}
          </div>
          <div className="info-item">
            <strong>年龄:</strong> {formData.step1?.age || '未填写'}
          </div>
          <div className="info-item">
            <strong>性别:</strong>{' '}
            {formData.step1?.gender === 'male'
              ? '男'
              : formData.step1?.gender === 'female'
                ? '女'
                : formData.step1?.gender === 'other'
                  ? '其他'
                  : '未填写'}
          </div>
        </div>
      </div>

      <div className="confirmation-section">
        <h3>联系信息（来自 step2）</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>邮箱:</strong> {formData.step2?.email || '未填写'}
          </div>
          <div className="info-item">
            <strong>电话:</strong> {formData.step2?.phone || '未填写'}
          </div>
          <div className="info-item">
            <strong>地址:</strong>{' '}
            {formData.step2?.address
              ? `${formData.step2.address.province || ''} ${
                  formData.step2.address.city || ''
                } ${formData.step2.address.street || ''}`
              : '未填写'}
          </div>
        </div>
      </div>

      {/* 本步骤自身的字段 */}
      <div className="form-grid">
        <FormItem label="职业" required error={errors.step3?.occupation}>
          <input
            type="text"
            {...register('step3.occupation', {
              required: '请输入职业',
              minLength: { value: 2, message: '职业至少2个字符' },
            })}
            className={errors.step3?.occupation ? 'error' : ''}
          />
        </FormItem>

        <FormItem label="备注" fullWidth>
          <textarea
            rows="4"
            {...register('step3.comments')}
            placeholder="请输入任何补充信息..."
          />
        </FormItem>
      </div>

      {/* 上一步 + 提交（submit 触发父级 form 的 handleSubmit） */}
      <div className="step-form-actions">
        <button type="button" onClick={goPrev} className="btn btn-secondary">
          上一步
        </button>
        <button type="submit" className="btn btn-success">
          提交
        </button>
      </div>
    </div>
  );
};

export default Step3V2;
