import { useSelector, useDispatch } from 'react-redux';
import { goToStep } from '../../store/formSlice';

const STEPS = [
  { number: 0, title: '个人信息' },
  { number: 1, title: '联系方式' },
  { number: 2, title: '地址信息' },
  { number: 3, title: '确认提交' },
];

const StepIndicator = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(state => state.form.currentStep);

  const handleStepClick = (step) => {
    dispatch(goToStep(step));
  };

  return (
    <div className="step-indicator">
      {STEPS.map((step, index) => (
        <div key={step.number} className="step-indicator-item">
          <div
            className={`step-circle ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
            onClick={() => handleStepClick(step.number)}
            style={{ cursor: 'pointer' }}
          >
            {currentStep > step.number ? '✓' : step.number + 1}
          </div>
          <span className="step-title">{step.title}</span>
          {index < STEPS.length - 1 && (
            <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;