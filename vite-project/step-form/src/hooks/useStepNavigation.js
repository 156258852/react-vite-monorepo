import { useState, useCallback, useRef } from 'react';

/**
 * Hook for step navigation (pure UI state, no form logic)
 * @param {number} stepCount - Total number of steps
 * @returns {Object} Navigation state and helpers
 */
export const useStepNavigation = stepCount => {
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const goTo = useCallback(
    step => {
      if (step >= 0 && step < stepCount) {
        setCurrentStep(step);
        return true;
      }
      return false;
    },
    [stepCount]
  );

  const goToNext = useCallback(
    targetStep => goTo(targetStep ?? currentStepRef.current + 1),
    [goTo]
  );

  const goToPrev = useCallback(() => goTo(currentStepRef.current - 1), [goTo]);

  const reset = useCallback(() => setCurrentStep(0), []);

  return { currentStep, currentStepRef, goTo, goToNext, goToPrev, reset };
};

export default useStepNavigation;
