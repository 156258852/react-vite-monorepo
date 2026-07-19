import { createContext, useContext } from 'react';

/**
 * 步骤导航 Context —— 只放自定义方法（goNext/goPrev/goToStep/getCurrentStepData/currentStep）
 * RHF 的 FormProvider 只透传已知方法（useMemo 依赖优化），自定义方法走独立 Context。
 */
export const StepNavContext = createContext(null);

/** 子组件用这个 hook 拿自定义导航方法（RHF 方法照常用 useFormContext） */
export const useStepNav = () => useContext(StepNavContext);
