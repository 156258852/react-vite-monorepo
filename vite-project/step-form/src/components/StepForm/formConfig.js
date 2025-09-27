// 基于Step1.jsx第7-8行的配置创建统一的表单验证配置函数
export const createFormValidateConfig = ({
  defaultValues = {},
  mode = 'onChange',
  reValidateMode = 'onChange', // 验证失败后，在输入时重新验证
  ...restConfig // 接收所有其他可能的 useForm 配置参数
} = {}) => ({
  mode,
  reValidateMode,
  defaultValues,
  ...restConfig, // 传递所有其他配置参数
});
