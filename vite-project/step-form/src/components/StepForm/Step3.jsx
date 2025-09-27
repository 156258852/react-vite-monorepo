import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect } from 'react';
import FormItem from './FormItem';
import { createFormValidateConfig } from './formConfig';

const Step3 = ({ defaultValues, allStepsData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm(
    createFormValidateConfig({
      defaultValues: {
        occupation: '',
        interests: [],
        comments: '',
        // 数组字段示例
        skills: [{ name: '', level: 'beginner' }],
        // 复杂数组示例
        workExperience: [
          {
            company: '',
            position: '',
            duration: {
              from: '',
              to: '',
            },
            responsibilities: [''],
          },
        ],
      },
    })
  );

  // 使用 useFieldArray 处理技能数组
  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: 'skills',
  });

  // 使用 useFieldArray 处理工作经验数组
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'workExperience',
  });

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
      <h2>确认信息</h2>

      {/* 显示之前填写的信息 */}
      <div className="confirmation-section">
        <h3>个人信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>姓名:</strong> {allStepsData.step1?.firstName || '未填写'}{' '}
            {allStepsData.step1?.lastName || ''}
          </div>
          <div className="info-item">
            <strong>年龄:</strong> {allStepsData.step1?.age || '未填写'}
          </div>
          <div className="info-item">
            <strong>性别:</strong>{' '}
            {allStepsData.step1?.gender === 'male'
              ? '男'
              : allStepsData.step1?.gender === 'female'
                ? '女'
                : allStepsData.step1?.gender === 'other'
                  ? '其他'
                  : '未填写'}
          </div>
        </div>
      </div>

      <div className="confirmation-section">
        <h3>联系信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>邮箱:</strong> {allStepsData.step2?.email || '未填写'}
          </div>
          <div className="info-item">
            <strong>电话:</strong> {allStepsData.step2?.phone || '未填写'}
          </div>
          <div className="info-item">
            <strong>街道地址:</strong>{' '}
            {allStepsData.step2?.address?.street || '未填写'}
          </div>
          <div className="info-item">
            <strong>城市:</strong>{' '}
            {allStepsData.step2?.address?.city || '未填写'}
          </div>
          <div className="info-item">
            <strong>省份:</strong>{' '}
            {allStepsData.step2?.address?.province || '未填写'}
          </div>
          <div className="info-item">
            <strong>邮政编码:</strong>{' '}
            {allStepsData.step2?.address?.zipCode || '未填写'}
          </div>
        </div>
      </div>

      {/* 补充信息 */}
      <form id="step-3-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-section">
          <h3>补充信息</h3>
          <div className="form-grid">
            <FormItem label="职业" required error={errors.occupation}>
              <input
                type="text"
                {...register('occupation', {
                  required: '请输入职业',
                  minLength: {
                    value: 2,
                    message: '职业至少2个字符',
                  },
                })}
                className={errors.occupation ? 'error' : ''}
              />
            </FormItem>

            <FormItem label="兴趣爱好">
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    value="reading"
                    {...register('interests')}
                  />
                  阅读
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    value="sports"
                    {...register('interests')}
                  />
                  运动
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    value="music"
                    {...register('interests')}
                  />
                  音乐
                </label>
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    value="travel"
                    {...register('interests')}
                  />
                  旅行
                </label>
              </div>
            </FormItem>

            <FormItem label="备注" fullWidth>
              <textarea
                rows="4"
                {...register('comments')}
                placeholder="请输入任何补充信息..."
              />
            </FormItem>
          </div>
        </div>

        {/* 技能数组字段演示 */}
        <div className="form-section" style={{ marginTop: '30px' }}>
          <h3>技能列表 (useFieldArray 示例)</h3>
          <div style={{ marginBottom: '15px' }}>
            <button
              type="button"
              onClick={() => appendSkill({ name: '', level: 'beginner' })}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              + 添加技能
            </button>
          </div>

          {skillsFields.map((field, index) => (
            <div
              key={field.id}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end',
                marginBottom: '15px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            >
              <FormItem
                label={`技能 ${index + 1}`}
                error={errors.skills?.[index]?.name}
              >
                <input
                  type="text"
                  {...register(`skills.${index}.name`, {
                    required: '请输入技能名称',
                  })}
                  placeholder="例如：JavaScript、设计、管理"
                  className={errors.skills?.[index]?.name ? 'error' : ''}
                />
              </FormItem>

              <FormItem label="熟练程度" error={errors.skills?.[index]?.level}>
                <select
                  {...register(`skills.${index}.level`)}
                  className={errors.skills?.[index]?.level ? 'error' : ''}
                >
                  <option value="beginner">初学者</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                  <option value="expert">专家</option>
                </select>
              </FormItem>

              <button
                type="button"
                onClick={() => removeSkill(index)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minWidth: '60px',
                }}
              >
                删除
              </button>
            </div>
          ))}
        </div>

        {/* 工作经验数组字段演示 */}
        <div className="form-section" style={{ marginTop: '30px' }}>
          <h3>工作经验 (复杂数组示例)</h3>
          <div style={{ marginBottom: '15px' }}>
            <button
              type="button"
              onClick={() =>
                appendExperience({
                  company: '',
                  position: '',
                  duration: { from: '', to: '' },
                  responsibilities: [''],
                })
              }
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              + 添加工作经验
            </button>
          </div>

          {experienceFields.map((field, index) => (
            <div
              key={field.id}
              style={{
                marginBottom: '20px',
                padding: '20px',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                backgroundColor: '#f8f9fa',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <h4 style={{ margin: 0 }}>工作经验 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  删除经验
                </button>
              </div>

              <div className="form-grid" style={{ marginBottom: '15px' }}>
                <FormItem
                  label="公司名称"
                  error={errors.workExperience?.[index]?.company}
                >
                  <input
                    type="text"
                    {...register(`workExperience.${index}.company`, {
                      required: '请输入公司名称',
                    })}
                    className={
                      errors.workExperience?.[index]?.company ? 'error' : ''
                    }
                  />
                </FormItem>

                <FormItem
                  label="职位"
                  error={errors.workExperience?.[index]?.position}
                >
                  <input
                    type="text"
                    {...register(`workExperience.${index}.position`, {
                      required: '请输入职位',
                    })}
                    className={
                      errors.workExperience?.[index]?.position ? 'error' : ''
                    }
                  />
                </FormItem>

                <FormItem
                  label="开始时间"
                  error={errors.workExperience?.[index]?.duration?.from}
                >
                  <input
                    type="date"
                    {...register(`workExperience.${index}.duration.from`)}
                    className={
                      errors.workExperience?.[index]?.duration?.from
                        ? 'error'
                        : ''
                    }
                  />
                </FormItem>

                <FormItem
                  label="结束时间"
                  error={errors.workExperience?.[index]?.duration?.to}
                >
                  <input
                    type="date"
                    {...register(`workExperience.${index}.duration.to`)}
                    className={
                      errors.workExperience?.[index]?.duration?.to
                        ? 'error'
                        : ''
                    }
                  />
                </FormItem>
              </div>

              <FormItem label="主要职责" fullWidth>
                <textarea
                  rows="3"
                  {...register(`workExperience.${index}.responsibilities.0`)}
                  placeholder="描述主要工作职责..."
                />
              </FormItem>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Step3;
