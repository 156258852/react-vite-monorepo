import { useSelector } from 'react-redux';
import StepIndicator from './StepIndicator';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import '../StepForm/StepForm.css';

const STEPS = [Step0, Step1, Step2, Step3];

const ReduxStepForm = () => {
  const currentStep = useSelector(state => state.form.currentStep);
  const CurrentStep = STEPS[currentStep];

  return (
    <div className="step-form">
      <div className="step-form-container">
        <h1 className="step-form-title">多步骤表单（Redux 版）</h1>

        <StepIndicator />

        <div className="step-form-content">
          <CurrentStep />
        </div>
      </div>
    </div>
  );
};

export default ReduxStepForm;