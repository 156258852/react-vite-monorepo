import { useSelector, useDispatch } from 'react-redux';
import { updateField, goToStep } from '../store/formSlice';
import { useFormValidation } from './useFormValidation';

/**
 * Custom hook for Redux-based step form
 * Combines validation logic with Redux state management
 *
 * @param {number} stepNumber - Current step number (0, 1, 2, etc.)
 * @param {Object} validators - Validation functions for each field
 * @param {Object} options - Optional configuration
 * @param {Object} options.conditionalFields - Fields that only show/validate conditionally
 * @returns {Object} Form state, handlers, and validation helpers
 */
export const useReduxStepForm = (stepNumber, validators, options = {}) => {
  const { conditionalFields = {} } = options;
  const dispatch = useDispatch();
  const stepData = useSelector(state => state.form.formData[`step${stepNumber}`]);

  const {
    errors,
    clearFieldError,
    validateStep,
    maybeClearError,
    getFieldsToClear,
  } = useFormValidation(validators, { conditionalFields });

  /**
   * Handle field value change
   */
  const handleChange = (field) => (e) => {
    const value = e.target.value;

    // Update Redux store
    dispatch(updateField({ step: stepNumber, field, value }));

    // Clear error if field is now valid
    const newData = { ...stepData, [field]: value };
    maybeClearError(field, value, newData);

    // Handle conditional fields that need to be cleared
    const fieldsToClear = getFieldsToClear(newData);
    fieldsToClear.forEach(condField => {
      if (condField !== field) {
        dispatch(updateField({ step: stepNumber, field: condField, value: '' }));
      }
    });
  };

  /**
   * Navigate to next step (validates first)
   */
  const goToNext = () => {
    if (validateStep(stepData)) {
      dispatch(goToStep(stepNumber + 1));
      return true;
    }
    return false;
  };

  /**
   * Navigate to previous step
   */
  const goToPrev = () => {
    dispatch(goToStep(stepNumber - 1));
  };

  /**
   * Navigate to a specific step
   */
  const goTo = (targetStep) => {
    dispatch(goToStep(targetStep));
  };

  return {
    // State
    stepData,
    errors,

    // Handlers
    handleChange,
    goToNext,
    goToPrev,
    goTo,

    // Validation helpers
    validateStep: () => validateStep(stepData),
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export default useReduxStepForm;
