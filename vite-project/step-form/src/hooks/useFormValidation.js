import { useState, useCallback } from 'react';

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

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((field) => {
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
    const validator = validators[field];
    if (!validator) return null;

    // Skip validation for conditional fields that aren't visible
    if (conditionalFields[field] && !conditionalFields[field](formData)) {
      return null;
    }

    return validator(value);
  }, [validators, conditionalFields]);

  /**
   * Validate all fields and return if valid
   */
  const validateStep = useCallback((formData) => {
    const newErrors = {};

    Object.keys(validators).forEach(field => {
      // Skip conditional fields that aren't visible
      if (conditionalFields[field] && !conditionalFields[field](formData)) {
        return;
      }

      const error = validators[field](formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validators, conditionalFields]);

  /**
   * Check if field error should be cleared on change
   */
  const maybeClearError = useCallback((field, value, formData = {}) => {
    if (errors[field]) {
      const error = validateField(field, value, formData);
      if (!error) {
        clearFieldError(field);
      }
    }
  }, [errors, validateField, clearFieldError]);

  /**
   * Get names of conditional fields that should be cleared
   */
  const getFieldsToClear = useCallback((formData) => {
    const fieldsToClear = [];

    Object.keys(conditionalFields).forEach(condField => {
      if (!conditionalFields[condField](formData)) {
        fieldsToClear.push(condField);
      }
    });

    return fieldsToClear;
  }, [conditionalFields]);

  /**
   * Set multiple errors at once (useful for server-side validation)
   */
  const setFieldErrors = useCallback((newErrors) => {
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
    validateStep,
    maybeClearError,
    getFieldsToClear,
    setFieldErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
};

export default useFormValidation;
