import { useSelector, useDispatch } from 'react-redux';
import { resetForm, goToStep } from '../../store/formSlice';

const Step3 = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.formData);

  const handleSubmit = () => {
    console.log('提交数据:', formData);
    alert('表单提交成功！请查看控制台输出。\n\n' + JSON.stringify(formData, null, 2));
    dispatch(resetForm());
  };

  const handlePrev = () => {
    dispatch(goToStep(2));
  };

  const getGenderText = (gender) => {
    const map = { male: '男', female: '女', other: '其他' };
    return map[gender] || '未填写';
  };

  return (
    <div className="step-content">
      <h2>确认信息</h2>

      <div className="confirmation-section">
        <h3>个人信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>姓名:</strong> {formData.step0?.firstName || '未填写'} {formData.step0?.lastName || ''}
          </div>
          <div className="info-item">
            <strong>年龄:</strong> {formData.step0?.age || '未填写'}
          </div>
          <div className="info-item">
            <strong>性别:</strong> {getGenderText(formData.step0?.gender)}
          </div>
        </div>
      </div>

      <div className="confirmation-section">
        <h3>联系方式</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>邮箱:</strong> {formData.step1?.email || '未填写'}
          </div>
          <div className="info-item">
            <strong>手机号:</strong> {formData.step1?.phone || '未填写'}
          </div>
        </div>
      </div>

      <div className="confirmation-section">
        <h3>地址信息</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>省份:</strong> {formData.step2?.province || '未填写'}
          </div>
          <div className="info-item">
            <strong>城市:</strong> {formData.step2?.city || '未填写'}
          </div>
          <div className="info-item">
            <strong>街道:</strong> {formData.step2?.street || '未填写'}
          </div>
          <div className="info-item">
            <strong>邮编:</strong> {formData.step2?.zipCode || '未填写'}
          </div>
        </div>
      </div>

      <div className="redux-debug-panel success">
        <strong>完整提交数据：</strong>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>

      <div className="step-form-actions">
        <button className="btn btn-secondary" onClick={handlePrev}>
          上一步
        </button>
        <button className="btn btn-success" onClick={handleSubmit}>
          提交
        </button>
      </div>
    </div>
  );
};

export default Step3;