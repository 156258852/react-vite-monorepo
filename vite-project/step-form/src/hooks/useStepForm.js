import { useState, useCallback, useRef } from 'react';
import { useForceUpdate } from './useForceUpdate';
import { useStepNavigation } from './useStepNavigation';

/**
 * Set a DOM input's value (handles checkbox via .checked)
 */
const setDOMValue = (el, value) => {
  if (el.type === 'checkbox') {
    el.checked = value;
  } else {
    el.value = value;
  }
};

/**
 * Custom hook for step form (uncontrolled)
 * Values stored in refs — no re-render on every keystroke
 * Use watch(field) for values that drive UI (conditional rendering)
 *
 * Validation rules can be sync (return string | null) or async (return Promise<string | null>).
 * validateField / validateStep / goToNext all return Promises.
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
      data[key] = { ...(initialData[key] ?? {}) };
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

  // Form values (ref = no re-render on change) — lazy init to avoid re-computing on every render
  const valuesRef = useRef(null);
  if (valuesRef.current === null) valuesRef.current = buildInitial();
  const initialDataRef = useRef(null);
  if (initialDataRef.current === null) initialDataRef.current = buildInitial();

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

  // Async validation race condition guard (per-field latest-wins)
  const validationCounterRef = useRef({});

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
    (field, value, step) => {
      const key = resolveKey(step);
      valuesRef.current[key] = { ...valuesRef.current[key], [field]: value };

      // Update DOM input if mounted
      const inputKey = `${key}.${field}`;
      const el = inputRefs.current[inputKey];
      if (el) setDOMValue(el, value);

      // Re-render if field is watched
      if (watchedFieldsRef.current.has(inputKey)) {
        forceRender();
      }

      // Clear error if field is now valid (supports async rules)
      const rule = fieldRulesRef.current[key]?.[field];
      if (rule) {
        const counterKey = `${key}.${field}`;
        const counters = validationCounterRef.current;
        const requestId = (counters[counterKey] =
          (counters[counterKey] || 0) + 1);
        Promise.resolve(rule(value)).then(error => {
          if (requestId !== counters[counterKey]) return;
          setFieldError(key, field, error);
        });
      }
    },
    [resolveKey, setFieldError, forceRender]
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

  /**
   * Validate a single field and set/clear its error.
   * Curried: validateField('email')()
   * Supports async rules — returns Promise<boolean>.
   * Latest-wins: stale async results are discarded.
   */
  const validateField = useCallback(
    field => async () => {
      const key = resolveKey();
      const rule = fieldRulesRef.current[key]?.[field];
      if (!rule) return true;

      const value = valuesRef.current[key]?.[field];

      // Per-field race guard: increment counter, only apply result if still latest
      const counterKey = `${key}.${field}`;
      const counters = validationCounterRef.current;
      const requestId = (counters[counterKey] =
        (counters[counterKey] || 0) + 1);
      const error = await rule(value);
      if (requestId !== counters[counterKey]) return !error;

      setFieldError(key, field, error);
      return !error;
    },
    [resolveKey, setFieldError]
  );

  /**
   * Validate all fields for the current step.
   * Supports async rules.
   * @returns Promise<{ values, errors? }> — errors only present when validation fails
   */
  const validateStep = useCallback(async () => {
    const key = resolveKey();
    const rules = fieldRulesRef.current[key] || {};

    // Run all field rules in parallel
    const entries = Object.keys(rules).map(async field => {
      const error = await rules[field](valuesRef.current[key]?.[field]);
      return [field, error];
    });
    const results = await Promise.all(entries);

    const newErrors = {};
    results.forEach(([field, error]) => {
      if (error) newErrors[field] = error;
    });

    // Merge per-field rather than overwrite entire step, avoids clobbering
    // in-flight async results from setFieldValue
    setErrors(prev => {
      const prevStep = prev[key] || {};
      const merged = { ...prevStep };
      // Clear fields that passed, set fields that failed
      Object.keys(rules).forEach(field => {
        if (newErrors[field]) {
          merged[field] = newErrors[field];
        } else {
          delete merged[field];
        }
      });
      return { ...prev, [key]: merged };
    });

    const result = { values: valuesRef.current[key] };
    if (Object.keys(newErrors).length > 0) result.errors = newErrors;
    return result;
  }, [resolveKey]);

  /**
   * Validate all steps at once.
   * @returns Promise<{ values, errors? }> — errors only present when any step fails
   */
  const validateAll = useCallback(async () => {
    const allErrors = {};
    const allValues = {};

    const results = await Promise.all(
      stepKeysRef.current.map(async key => {
        const rules = fieldRulesRef.current[key] || {};
        const entries = Object.keys(rules).map(async field => {
          const error = await rules[field](valuesRef.current[key]?.[field]);
          return [field, error];
        });
        const fieldResults = await Promise.all(entries);
        const stepErrors = {};
        fieldResults.forEach(([field, error]) => {
          if (error) stepErrors[field] = error;
        });
        return [key, stepErrors];
      })
    );

    let hasErrors = false;
    results.forEach(([key, stepErrors]) => {
      allErrors[key] = stepErrors;
      allValues[key] = valuesRef.current[key];
      if (Object.keys(stepErrors).length > 0) hasErrors = true;
    });

    setErrors(allErrors);

    const result = { values: allValues };
    if (hasErrors) result.errors = allErrors;
    return result;
  }, []);

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
      const initialValue = valuesRef.current[currentKey]?.[field] ?? '';
      const isCheckbox = restOverrides.type === 'checkbox';
      return {
        ref: el => {
          if (inputRefs.current[inputKey] === el) return;
          inputRefs.current[inputKey] = el;
        },
        ...(isCheckbox
          ? { defaultChecked: !!initialValue }
          : { defaultValue: initialValue }),
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

  /**
   * Navigate to next step (validates first).
   * Returns Promise<boolean> — true only if validation passed AND navigation happened.
   * Returns false at boundary (last step) even if validation passed.
   */
  const goToNext = useCallback(
    async targetStep => {
      const { errors } = await validateStep();
      if (errors) return false;

      const next = targetStep ?? currentStepRef.current + 1;
      const moved = rawGoTo(next);
      if (moved) {
        watchedFieldsRef.current.clear();
      }
      return moved;
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
    validationCounterRef.current = {};

    // Reset DOM inputs to initial values
    Object.entries(inputRefs.current).forEach(([inputKey, el]) => {
      if (el) {
        const dotIdx = inputKey.indexOf('.');
        const stepKey = inputKey.slice(0, dotIdx);
        const field = inputKey.slice(dotIdx + 1);
        setDOMValue(el, initialDataRef.current[stepKey]?.[field] ?? '');
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
          setDOMValue(el, initialDataRef.current[key]?.[field] ?? '');
        }
      });

      // Invalidate in-flight async validations for this step
      const counters = validationCounterRef.current;
      Object.keys(counters).forEach(k => {
        if (k.startsWith(prefix)) counters[k]++;
      });

      // Re-render so watched fields pick up reset values
      forceRender();
    },
    [resolveKey, forceRender]
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
    validateAll,
  };
};

export default useStepForm;
