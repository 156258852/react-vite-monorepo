# Step Form 项目

## 项目概述

这是一个基于 **React 19 + Vite 7 + React Hook Form** 构建的多步骤表单演示项目。项目展示了如何使用 `react-hook-form` 实现复杂的多步骤表单流程，包括表单状态管理、数据持久化、自定义表单组件封装等多种技术模式。

### 核心技术栈

- **React 19.1.1** - UI 框架
- **Vite 7.1.6** - 构建工具
- **react-hook-form 7.62.0** - 表单状态管理库

### 项目特点

1. **多步骤表单流程** - 支持 4 个步骤的表单数据收集
2. **表单状态持久化** - 步骤间数据自动保存和恢复
3. **自定义组件集成** - 演示了三种自定义组件与 react-hook-form 的集成方式
4. **表单验证** - 支持必填、最小长度、正则表达式等多种验证规则

## 构建与运行命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (端口 3003)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 项目结构

```
src/
├── App.jsx              # 根组件，渲染 StepForm
├── App.css              # 应用级样式
├── main.jsx             # 应用入口
├── index.css            # 全局样式
└── components/
    └── StepForm/
        ├── index.js           # 导出入口
        ├── StepForm.jsx       # 主容器组件，管理步骤状态
        ├── StepForm.css       # 步骤表单样式
        ├── StepIndicator.jsx  # 步骤指示器组件
        ├── FormItem.jsx       # 通用表单项包装组件
        ├── formConfig.js      # 表单配置工具函数
        ├── Step0.jsx          # 自定义组件演示页面
        ├── Step1.jsx          # 个人信息表单
        ├── Step2.jsx          # 地址信息表单
        └── Step3.jsx          # 确认信息页面
```

## 核心组件说明

### StepForm.jsx - 主容器组件

负责管理整个多步骤表单的状态：
- `currentStep`: 当前步骤索引 (0-3)
- `stepData`: 各步骤已保存的数据

核心方法：
- `nextStep(stepData)`: 保存当前步骤数据并前进
- `prevStep()`: 返回上一步
- `handleFinalSubmit(stepData)`: 最终提交，合并所有步骤数据

### Step0.jsx - 自定义组件演示

展示了 react-hook-form 与自定义组件集成的三种方式：

1. **register** - 适用于原生 HTML 表单元素
   ```jsx
   <input {...register('fieldName', { required: '错误信息' })} />
   ```

2. **Controller** - 适用于 JSX 中的临时自定义组件
   ```jsx
   <Controller
     name="fieldName"
     control={control}
     rules={{ required: '错误信息' }}
     render={({ field }) => <CustomInput {...field} />}
   />
   ```

3. **useController** - 适用于封装可复用的组件库
   ```jsx
   const { field, fieldState } = useController({
     name: 'fieldName',
     control,
     rules: { required: '错误信息' }
   });
   ```

### formConfig.js - 表单配置工具

提供 `createFormValidateConfig` 函数，统一创建 `useForm` 配置：

```js
useForm(createFormValidateConfig({
  defaultValues: { /* 默认值 */ },
  mode: 'onChange',
}));
```

## 开发规范

### 表单开发模式

1. 每个步骤组件接收 `defaultValues`、`allStepsData`、`onSubmit` 三个 props
2. 使用 `createFormValidateConfig` 创建表单配置
3. 表单 ID 格式：`step-{n}-form`，用于外部提交按钮关联
4. 步骤间导航使用 `form` 属性关联提交按钮

### 组件命名约定

- 步骤组件：`Step0.jsx`, `Step1.jsx`, ...
- 样式文件：与组件同名的 `.css` 文件
- 导出入口：`index.js` 统一导出

### 表单验证

- 使用 react-hook-form 内置验证规则
- 自定义验证通过 `validate` 函数实现
- 错误信息通过 `formState.errors` 获取并显示

## 调试技巧

- 使用 `watch()` 监听表单值变化
- 使用 `getValues()` 获取当前所有值
- 使用 `formState` 查看表单状态（isValid、isDirty、errors 等）
- 开发时可添加实时数据展示面板辅助调试