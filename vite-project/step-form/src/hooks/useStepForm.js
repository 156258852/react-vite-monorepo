import { useDispatch } from 'react-redux';
import { useCallback, useRef } from 'react';
import { updateField, goToStep } from '../store/formSlice';
import { useFormValidation } from './useFormValidation';

/**
 * Custom hook for step form with Redux dispatch
 * Combines validation logic with field update and navigation
 * Note: stepData is caller-provided, mutations go through Redux dispatch
 *
 * @param {number} stepNumber - Current step number (0, 1, 2, etc.)
 * @param {Object} validators - Validation functions for each field (can be empty, use fieldProps rules instead)
 * @param {Object} stepData - Current step's form data (passed in by caller)
 * @returns {Object} Form state, handlers, and validation helpers
 */
export const useStepForm = (stepNumber, validators = {}, stepData = {}) => {
  const dispatch = useDispatch();

  const {
    errors,
    setErrors,
    clearFieldError,
    maybeClearError,
    setFieldErrors,
    hasErrors,
  } = useFormValidation(validators);

  // Keep latest stepData in a ref so handleChange always sees fresh data
  // even when multiple change events fire before re-render
  const stepDataRef = useRef(stepData);
  stepDataRef.current = stepData;

  // Collect field-level rules registered via fieldProps(field, { rules })
  // These are merged with global validators: field-level overrides global
  const fieldRulesRef = useRef({});

  /**
   * Get merged validators: global validators + field-level rules
   */
  const getMergedValidators = useCallback(() => ({
    ...validators,
    ...fieldRulesRef.current,
  }), [validators]);

  /**
   * Set a field's value directly (core logic, no event parsing)
   */
  const setFieldValue = useCallback(
    (field, value) => {
      // Update Redux store
      dispatch(updateField({ step: stepNumber, field, value }));

      // Clear error if field is now valid
      const newData = { ...stepDataRef.current, [field]: value };
      maybeClearError(field, value, newData);
    },
    [dispatch, stepNumber, maybeClearError]
  );

  /**
   * Convenience wrapper: extracts e.target.value for native inputs
   */
  const handleChange = useCallback(
    field => e => setFieldValue(field, e.target.value),
    [setFieldValue]
  );

  /**
   * Validate a single field and set/clear its error
   * Uses merged validators (global + field-level rules)
   * Curried: validateField('email')
   */
  const validateField = useCallback(
    field => () => {
      const merged = getMergedValidators();
      const rule = merged[field];
      if (!rule) return true;

      const value = stepDataRef.current[field];
      const error = rule(value);
      if (error) {
        setFieldErrors({ [field]: error });
      } else {
        clearFieldError(field);
      }
      return !error;
    },
    [getMergedValidators, setFieldErrors, clearFieldError]
  );

  /**
   * Generate all props for a field in one call
   * Usage: <input {...fieldProps('email')} />
   * With rules: <input {...fieldProps('email', { rules: fn })} />
   * Override: <input {...fieldProps('email', { onBlur: undefined })} />
   */
  const fieldProps = useCallback(
    (field, overrides = {}) => {
      // Register field-level rules if provided
      if (overrides.rules) {
        fieldRulesRef.current[field] = overrides.rules;
      }
      const restOverrides = { ...overrides };
      delete restOverrides.rules;
      return {
        value: stepData[field] || '',
        onChange: handleChange(field),
        onBlur: validateField(field),
        className: errors[field] ? 'error' : '',
        ...restOverrides,
      };
    },
    [stepData, handleChange, validateField, errors]
  );

  /**
   * Validate all fields using merged validators (global + field-level rules)
   */
  const mergedValidateStep = useCallback(formData => {
    const merged = getMergedValidators();
    const newErrors = {};
    Object.keys(merged).forEach(field => {
      const error = merged[field](formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [getMergedValidators, setErrors]);

  /**
   * Navigate to next step (validates first)
   */
  const goToNext = useCallback(
    targetStep => {
      if (mergedValidateStep(stepData)) {
        const next = targetStep ?? stepNumber + 1;
        dispatch(goToStep(next));
        return true;
      }
      return false;
    },
    [dispatch, stepNumber, stepData, mergedValidateStep]
  );

  /**
   * Navigate to previous step
   */
  const goToPrev = useCallback(() => {
    if (stepNumber > 0) {
      dispatch(goToStep(stepNumber - 1));
    }
  }, [dispatch, stepNumber]);

  /**
   * Navigate to a specific step
   */
  const goTo = useCallback(
    targetStep => {
      dispatch(goToStep(targetStep));
    },
    [dispatch]
  );

  return {
    // State
    stepData,
    errors,

    // Handlers
    handleChange,
    setFieldValue,
    validateField,
    fieldProps,
    goToNext,
    goToPrev,
    goTo,

    // Validation helpers
    validateStep: () => mergedValidateStep(stepData),
    clearFieldError,
    hasErrors,
  };
};

export default useStepForm;
