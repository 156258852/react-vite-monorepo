const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 0, title: '自定义组件' },
    { number: 1, title: '个人信息' },
    { number: 2, title: '联系信息' },
    { number: 3, title: '确认信息' },
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={step.number} className="step-indicator-item">
          <div
            className={`step-circle ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
          >
            {currentStep > step.number
              ? '✓'
              : step.number === 0
                ? '🔧'
                : step.number}
          </div>
          <span className="step-title">{step.title}</span>
          {index < steps.length - 1 && (
            <div
              className={`step-line ${currentStep > step.number ? 'completed' : ''}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
