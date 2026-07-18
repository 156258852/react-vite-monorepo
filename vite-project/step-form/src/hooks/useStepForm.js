import { useState, useCallback, useRef } from 'react';
import { useForceUpdate } from './useForceUpdate';
import { useStepNavigation } from './useStepNavigation';

/**
 * Custom hook for step form (uncontrolled)
 * Values stored in refs — no re-render on every keystroke
 * Use watch(field) for values that drive UI (conditional rendering)
 *
 * @param {Object} options - Configuration
 * @param {number} [options.totalSteps] - Total number of steps (generates step0, step1, ...)
 * @param {string[]} [options.stepKeys] - Custom step keys (overrides totalSteps)
 * @param {Object} [options.initialData] - Initial form data across all steps
 * @param {boolean} [options.validateOnBlur=true] - Global default for blur validation
 * @returns {Object} Form state, handlers, and validation helpers
 */
export const useStepForm = (options = {}) => {
  // ─── Config & Keys ───────────────────────────────────────────
  const {
    totalSteps,
    stepKeys: customKeys,
    initialData = {},
    validateOnBlur = true,
  } = options;

  if (!customKeys && !totalSteps) {
    throw new Error('useStepForm: 必须提供 totalSteps 或 stepKeys');
  }

  const stepKeys =
    customKeys || Array.from({ length: totalSteps }, (_, i) => `step${i}`);
  const stepCount = stepKeys.length;

  const buildInitial = () => {
    const data = {};
    stepKeys.forEach(key => {
      data[key] = { ...(initialData[key] || {}) };
    });
    return data;
  };

  // ─── State & Refs ────────────────────────────────────────────
  // Step navigation (delegated to useStepNavigation)
  const {
    currentStep,
    currentStepRef,
    goTo: rawGoTo,
    reset: navReset,
  } = useStepNavigation(stepCount);

  const currentKey = stepKeys[currentStep];

  // Errors namespaced by step key: { [stepKey]: { [field]: message } }
  const [errors, setErrors] = useState({});

  // Form values (ref = no re-render on change)
  const valuesRef = useRef(buildInitial());
  const initialDataRef = useRef(buildInitial());

  // DOM input refs for programmatic updates
  const inputRefs = useRef({});

  // Watch mechanism: watched fields trigger re-render on change
  const watchedFieldsRef = useRef(new Set());
  const forceRender = useForceUpdate();

  // Field rules namespaced by step key: { [stepKey]: { [field]: fn } }
  const fieldRulesRef = useRef({});

  // Stale closure prevention refs
  const stepKeysRef = useRef(stepKeys);
  stepKeysRef.current = stepKeys;
  const validateOnBlurRef = useRef(validateOnBlur);
  validateOnBlurRef.current = validateOnBlur;

  // ─── Internal Helpers ────────────────────────────────────────

  /** Resolve step param (index / key / null=current) to step key */
  const resolveKey = useCallback(step => {
    if (step == null) return stepKeysRef.current[currentStepRef.current];
    return typeof step === 'number' ? stepKeysRef.current[step] : step;
  }, []);

  /** Set or clear a single field's error (falsy error = clear) */
  const setFieldError = useCallback((key, field, error) => {
    setErrors(prev => {
      if (error) {
        return { ...prev, [key]: { ...prev[key], [field]: error } };
      }
      const stepErrors = prev[key];
      if (!stepErrors || !stepErrors[field]) return prev;
      const { [field]: _, ...rest } = stepErrors;
      return { ...prev, [key]: rest };
    });
  }, []);

  // ─── Value Operations ────────────────────────────────────────

  /** Get all form values (snapshot from ref) */
  const getValues = useCallback(() => valuesRef.current, []);

  /** Get a field value from any step */
  const getFieldValue = useCallback(
    (step, field) => valuesRef.current[resolveKey(step)]?.[field],
    [resolveKey]
  );

  /** Set a field's value (updates ref + DOM, no re-render unless watched) */
  const setFieldValue = useCallback(
    (field, value) => {
      const key = resolveKey();
      valuesRef.current[key] = { ...valuesRef.current[key], [field]: value };

      // Update DOM input if mounted
      const inputKey = `${key}.${field}`;
      const el = inputRefs.current[inputKey];
      if (el) el.value = value;

      // Re-render if field is watched
      if (watchedFieldsRef.current.has(inputKey)) {
        forceRender();
      }

      // Clear error if field is now valid
      const rule = fieldRulesRef.current[key]?.[field];
      if (rule && !rule(value)) {
        setFieldError(key, field, null);
      }
    },
    [resolveKey, setFieldError]
  );

  /** Convenience wrapper: extracts value from native inputs */
  const handleChange = useCallback(
    field => e => {
      let val;
      if (e && e.target) {
        const { type, checked, value } = e.target;
        val = type === 'checkbox' ? checked : value;
      } else {
        val = e;
      }
      setFieldValue(field, val);
    },
    [setFieldValue]
  );

  // ─── Validation ──────────────────────────────────────────────

  /** Validate a single field and set/clear its error. Curried: validateField('email')() */
  const validateField = useCallback(
    field => () => {
      const key = resolveKey();
      const rule = fieldRulesRef.current[key]?.[field];
      if (!rule) return true;

      const value = valuesRef.current[key]?.[field];
      const error = rule(value);
      setFieldError(key, field, error);
      return !error;
    },
    [resolveKey, setFieldError]
  );

  /** Validate all fields for the current step */
  const validateStep = useCallback(() => {
    const key = resolveKey();
    const rules = fieldRulesRef.current[key] || {};
    const newErrors = {};
    Object.keys(rules).forEach(field => {
      const error = rules[field](valuesRef.current[key]?.[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(prev => ({ ...prev, [key]: newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [resolveKey]);

  // ─── Field Binding ───────────────────────────────────────────

  /** Generate all props for a field in one call (uncontrolled) */
  const fieldProps = useCallback(
    (field, overrides = {}) => {
      const {
        rules,
        validateOnBlur: fieldValidateOnBlur,
        ...restOverrides
      } = overrides;
      const shouldValidateOnBlur =
        fieldValidateOnBlur ?? validateOnBlurRef.current;

      // Register field-level rules if provided
      if (rules) {
        fieldRulesRef.current[currentKey] = {
          ...fieldRulesRef.current[currentKey],
          [field]: rules,
        };
      }

      const inputKey = `${currentKey}.${field}`;
      return {
        ref: el => {
          inputRefs.current[inputKey] = el;
        },
        defaultValue: valuesRef.current[currentKey]?.[field] ?? '',
        onChange: handleChange(field),
        onBlur: shouldValidateOnBlur ? validateField(field) : undefined,
        className: errors[currentKey]?.[field] ? 'error' : '',
        ...restOverrides,
      };
    },
    [currentKey, handleChange, validateField, errors]
  );

  /** Watch a field — returns current value and triggers re-render on change */
  const watch = useCallback(
    field => {
      const inputKey = `${currentKey}.${field}`;
      watchedFieldsRef.current.add(inputKey);
      return valuesRef.current[currentKey]?.[field];
    },
    [currentKey]
  );

  // ─── Navigation (wraps useStepNavigation with validation) ────

  /** Navigate to next step (validates first) */
  const goToNext = useCallback(
    targetStep => {
      if (validateStep()) {
        const next = targetStep ?? currentStepRef.current + 1;
        if (rawGoTo(next)) {
          watchedFieldsRef.current.clear();
        }
        return true;
      }
      return false;
    },
    [validateStep, rawGoTo, currentStepRef]
  );

  /** Navigate to previous step */
  const goToPrev = useCallback(() => {
    if (rawGoTo(currentStepRef.current - 1)) {
      watchedFieldsRef.current.clear();
    }
  }, [rawGoTo, currentStepRef]);

  /** Navigate to a specific step */
  const goTo = useCallback(
    step => {
      if (rawGoTo(step)) {
        watchedFieldsRef.current.clear();
      }
    },
    [rawGoTo]
  );

  // ─── Reset ───────────────────────────────────────────────────

  /** Reset entire form to initial state */
  const reset = useCallback(() => {
    navReset();
    const fresh = {};
    Object.keys(initialDataRef.current).forEach(key => {
      fresh[key] = { ...initialDataRef.current[key] };
    });
    valuesRef.current = fresh;
    setErrors({});
    fieldRulesRef.current = {};
    watchedFieldsRef.current.clear();

    // Reset DOM inputs to initial values
    Object.entries(inputRefs.current).forEach(([inputKey, el]) => {
      if (el) {
        const [stepKey, field] = inputKey.split('.');
        el.value = initialDataRef.current[stepKey]?.[field] ?? '';
      }
    });
    inputRefs.current = {};
  }, [navReset]);

  /** Reset a single step to its initial state */
  const resetStep = useCallback(
    step => {
      const key = resolveKey(step);

      // Reset values for this step only
      valuesRef.current[key] = { ...initialDataRef.current[key] };

      // Clear errors for this step only
      setErrors(prev => {
        if (!prev[key]) return prev;
        const { [key]: _, ...rest } = prev;
        return rest;
      });

      // Reset DOM inputs for this step only
      const prefix = `${key}.`;
      Object.entries(inputRefs.current).forEach(([inputKey, el]) => {
        if (el && inputKey.startsWith(prefix)) {
          const field = inputKey.slice(prefix.length);
          el.value = initialDataRef.current[key]?.[field] ?? '';
        }
      });

      // Re-render so watched fields pick up reset values
      forceRender();
    },
    [resolveKey]
  );

  // ─── Snapshots & Return ──────────────────────────────────────
  const stepData = valuesRef.current[currentKey] || {};
  const stepErrors = errors[currentKey] || {};
  const formData = valuesRef.current;

  return {
    // State
    currentStep,
    currentKey,
    stepData,
    stepErrors,
    formData,
    errors,

    // Handlers
    handleChange,
    setFieldValue,
    validateField,
    fieldProps,
    goToNext,
    goToPrev,
    goTo,
    reset,
    resetStep,
    getFieldValue,
    getValues,
    watch,

    // Validation helpers
    validateStep,
  };
};

export default useStepForm;
