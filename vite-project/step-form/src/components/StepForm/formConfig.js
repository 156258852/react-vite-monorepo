/**
 * 创建统一的表单验证配置函数
 *
 * 验证模式说明（参考 react-hook-form 源码 skipValidation.ts）：
 * - mode: 首次验证触发时机
 * - reValidateMode: 验证失败后重新验证的时机
 *
 * 推荐配置：
 * - mode: 'onSubmit' → 首次验证只在提交时触发，避免用户输入时被打断
 * - reValidateMode: 'onChange' → 验证失败后，实时验证，满足条件立即清除错误
 *
 * @param {Object} config - 配置参数
 * @param {Object} config.defaultValues - 默认值
 * @param {string} config.mode - 验证模式: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'
 * @param {string} config.reValidateMode - 重验证模式: 'onBlur' | 'onChange'
 */
export const createFormValidateConfig = ({
  defaultValues = {},
  mode = 'onSubmit',       // 首次验证只在提交时触发
  reValidateMode = 'onChange', // 验证失败后，输入时实时重新验证
  ...restConfig
} = {}) => ({
  mode,
  reValidateMode,
  defaultValues,
  ...restConfig,
});
