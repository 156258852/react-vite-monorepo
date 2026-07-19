import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import StepIndicator from '../StepForm/StepIndicator';
import Step0V2 from './Step0V2';
import Step1V2 from './Step1V2';
import Step2V2 from './Step2V2';
import Step3V2 from './Step3V2';
import { StepNavContext } from './stepNavContext';
import '../StepForm/StepForm.css';

// step 组件数组，用 currentStep 作索引渲染
const STEPS = [Step0V2, Step1V2, Step2V2, Step3V2];

const StepFormV2 = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = STEPS.length;

  // 单个 useForm 管理所有步骤的数据，按 step 分组（嵌套结构）
  // shouldUnregister:false（RHF 默认值）：step 卸载后字段值与注册信息仍保留，
  // 这样只渲染当前 step 也能在提交时校验全部字段。
  const methods = useForm({
    mode: 'onTouched',
    shouldUnregister: false,
    defaultValues: {
      step0: { hobby: '', level: 'beginner' },
      step1: { firstName: '', lastName: '', age: '', gender: '' },
      step2: {
        email: '',
        phone: '',
        address: { street: '', city: '', province: '', zipCode: '' },
      },
      step3: { occupation: '', comments: '' },
    },
  });

  const { handleSubmit, getValues } = methods;

  // 当前 step 组件（用索引从数组取）
  const CurrentStep = STEPS[currentStep];

  // ---- 自定义方法：只提供“跳步”能力，不内置校验 ----
  // 校验由各 step 自己用 handleSubmit 控制（拿到 data 后可以调 API、动态选目标步）
  const goToStep = target => {
    if (target < 0 || target >= totalSteps) return;
    setCurrentStep(target);
  };

  // 上一步 = 直接退，不校验
  const goPrev = () => goToStep(currentStep - 1);

  const goNext = () => goToStep(currentStep + 1);

  // 拿当前步数据
  const getCurrentStepData = () => getValues(`step${currentStep}`);

  // 最终提交：handleSubmit 校验所有已注册字段（shouldUnregister:false 保证全 step 已注册）
  const onFinalSubmit = data => {
    console.log('✅ 全部表单数据:', data);
    alert('提交成功！请查看控制台输出。');
  };

  // 自定义导航方法 —— 走独立 Context（FormProvider 只透传 RHF 已知方法）
  const stepNav = {
    currentStep,
    totalSteps,
    getCurrentStepData,
    goToStep, // 纯跳步，不校验
    goPrev,
    goNext,
  };

  return (
    <FormProvider {...methods}>
      <StepNavContext.Provider value={stepNav}>
        <div className="step-form">
          <div className="step-form-container">
            <h1 className="step-form-title">
              多步骤表单 V2（单 Form + 嵌套路径）
            </h1>

            {/* 说明：本版本只渲染当前 step，依赖 shouldUnregister:false 保留字段注册 */}
            <div
              style={{
                padding: '10px 16px',
                marginBottom: '12px',
                backgroundColor: '#e3f2fd',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#1565c0',
              }}
            >
              ℹ️ 本版本只渲染当前 step（steps[currentStep]）， 依赖{' '}
              <code>shouldUnregister:false</code> 让卸载 step
              的字段值与注册信息保留，提交时仍可校验全部字段。
            </div>

            <StepIndicator currentStep={currentStep} />

            <form id="step-form-v2" onSubmit={handleSubmit(onFinalSubmit)}>
              {/*
               * 只渲染当前 step，每个 step 内部自己渲染按钮（goNext/goPrev/submit）
               * shouldUnregister:false 保证卸载 step 的字段值与注册信息不丢
               */}
              <CurrentStep />
            </form>
          </div>
        </div>
      </StepNavContext.Provider>
    </FormProvider>
  );
};

export default StepFormV2;
