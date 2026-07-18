import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 0,
  formData: {
    step0: {},
    step1: {},
    step2: {},
    step3: {},
  },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // 更新单字段
    updateField: (state, action) => {
      const { step, field, value } = action.payload;
      state.formData[`step${step}`][field] = value;
    },

    // 更新整个步骤数据（批量）
    updateStepData: (state, action) => {
      const { step, data } = action.payload;
      state.formData[`step${step}`] = {
        ...state.formData[`step${step}`],
        ...data,
      };
    },

    // 步骤导航
    goToStep: (state, action) => {
      state.currentStep = action.payload;
    },

    // 重置表单
    resetForm: () => initialState,

    // 从外部同步整个表单状态
    syncForm: (state, action) => {
      const { formData, currentStep } = action.payload;
      state.formData = formData;
      state.currentStep = currentStep;
    },
  },
});

export const { updateField, updateStepData, goToStep, resetForm, syncForm } =
  formSlice.actions;
export default formSlice.reducer;
