import { useStepForm, FormCtx } from '../../hooks';
import StepIndicator from './StepIndicator';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import '../StepForm/StepForm.css';

const STEPS = [Step0, Step1, Step2, Step3];

const ReduxStepForm = () => {
  const form = useStepForm({
    totalSteps: STEPS.length,
    stepKeys: ['personalInfo', 'contact', '123', '1234'],
    initialData: { personalInfo: { firstName: 'John' } },
    validateOnBlur: false,
  });

  const safeStep = STEPS[form.currentStep] ? form.currentStep : 0;
  const CurrentStep = STEPS[safeStep];

  return (
    <FormCtx.Provider value={form}>
      <div className="step-form">
        <div className="step-form-container">
          <h1 className="step-form-title">多步骤表单（Redux 版）</h1>

          <StepIndicator />

          <div className="step-form-content">
            <CurrentStep />
          </div>
        </div>
      </div>
    </FormCtx.Provider>
  );
};

export default ReduxStepForm;
