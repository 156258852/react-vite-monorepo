import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} validators - Object with field names as keys and validator functions as values
 * @param {Object} options - Optional configuration
 * @param {Object} options.conditionalFields - Fields that only validate when condition is met
 * @returns {Object} Validation state and helper functions
 */
export const useFormValidation = (validators, options = {}) => {
  const { conditionalFields = {} } = options;
  const [errors, setErrors] = useState({});

  // Use refs to keep callbacks stable even when callers pass new object literals each render
  const validatorsRef = useRef(validators);
  const conditionalFieldsRef = useRef(conditionalFields);
  validatorsRef.current = validators;
  conditionalFieldsRef.current = conditionalFields;

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback(field => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Validate a single field value
   */
  const validateField = useCallback((field, value, formData = {}) => {
    const v = validatorsRef.current;
    const cf = conditionalFieldsRef.current;
    const validator = v[field];
    if (!validator) return null;

    // Skip validation for conditional fields that aren't visible
    if (cf[field] && !cf[field](formData)) {
      return null;
    }

    return validator(value);
  }, []);

  /**
   * Validate a single field and set/clear its error
   */
  const validateFieldAndSet = useCallback((field, value, formData = {}) => {
    const error = validateField(field, value, formData);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      clearFieldError(field);
    }
    return !error;
  }, [validateField, clearFieldError]);

  /**
   * Validate all fields and return if valid
   */
  const validateStep = useCallback(formData => {
    const v = validatorsRef.current;
    const cf = conditionalFieldsRef.current;
    const newErrors = {};

    Object.keys(v).forEach(field => {
      // Skip conditional fields that aren't visible
      if (cf[field] && !cf[field](formData)) {
        return;
      }

      const error = v[field](formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  /**
   * Check if field error should be cleared on change
   * Uses functional setState to avoid stale closure over `errors`
   */
  const maybeClearError = useCallback(
    (field, value, formData = {}) => {
      setErrors(prev => {
        if (!prev[field]) return prev;
        const error = validateField(field, value, formData);
        if (!error) {
          const { [field]: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    },
    [validateField]
  );

  /**
   * Get names of conditional fields that should be cleared
   */
  const getFieldsToClear = useCallback(formData => {
    const cf = conditionalFieldsRef.current;
    const fieldsToClear = [];

    Object.keys(cf).forEach(condField => {
      if (!cf[condField](formData)) {
        fieldsToClear.push(condField);
      }
    });

    return fieldsToClear;
  }, []);

  /**
   * Set multiple errors at once (useful for server-side validation)
   */
  const setFieldErrors = useCallback(newErrors => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    setErrors,
    clearFieldError,
    clearAllErrors,
    validateField,
    validateFieldAndSet,
    validateStep,
    maybeClearError,
    getFieldsToClear,
    setFieldErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export default useFormValidation;
