# React Monorepo

这是一个使用pnpm管理的React项目monorepo，包含以下项目：

## Vite项目

所有Vite项目都位于[vite-project](file:///Users/lhy/Desktop/react-monorepo/vite-project/pdf-viewer/src/App.tsx#L13-L31)目录下：

1. [pdf-viewer](file:///Users/lhy/Desktop/react-monorepo/vite-project/pdf-viewer/src/App.tsx#L13-L31) - PDF查看器应用
2. [redux-toolkit-demo](file:///Users/lhy/Desktop/react-monorepo/vite-project/redux-toolkit-demo/src/features/counter/counterSlice.ts#L1-L33) - Redux Toolkit演示应用
3. [step-form](file:///Users/lhy/Desktop/react-monorepo/vite-project/step-form/src/App.tsx#L10-L54) - 步骤表单应用
4. [my-new-app](file:///Users/lhy/Desktop/react-monorepo/vite-project/my-new-app/src/App.jsx#L1-L35) - 新的React应用示例

## 目录结构

```
.
├── vite-project/        # 所有Vite项目
│   ├── pdf-viewer/      # PDF查看器应用
│   ├── redux-toolkit-demo/  # Redux Toolkit演示应用
│   ├── step-form/       # 步骤表单应用
│   └── my-new-app/      # 新的React应用示例
├── packages/            # 未来可能添加的共享包或webpack项目
├── package.json         # 根目录package.json
└── pnpm-workspace.yaml  # pnpm工作区配置
```

## 前置要求

- Node.js >= 16
- pnpm >= 7

## 安装

```bash
pnpm install
```

## 开发

```bash
# 启动所有项目
pnpm dev

# 启动特定项目
pnpm --filter pdf-viewer dev
pnpm --filter redux-toolkit-demo dev
pnpm --filter step-form dev
pnpm --filter my-new-app dev
```

## 构建

```bash
# 构建所有项目
pnpm build

# 构建特定项目
pnpm --filter pdf-viewer build
pnpm --filter redux-toolkit-demo build
pnpm --filter step-form build
pnpm --filter my-new-app build
```

## 测试

```bash
# 运行所有测试
pnpm test
```

## 添加新项目

要添加新的Vite项目：

1. 在[vite-project](file:///Users/lhy/Desktop/react-monorepo/vite-project/pdf-viewer/src/App.tsx#L13-L31)目录下创建新项目文件夹
2. 将其添加到`pnpm-workspace.yaml`中的packages列表

要添加webpack项目：

1. 在[packages](file:///Users/lhy/Desktop/react-monorepo/packages)目录下创建新项目
2. pnpm会自动将其识别为工作区的一部分

## 项目说明

### pdf-viewer

一个使用react-pdf库的PDF查看器应用。

### redux-toolkit-demo

一个演示Redux Toolkit和Redux-Saga使用的应用。

### step-form

一个实现多步骤表单的React应用。

### my-new-app

一个新的React应用示例，使用Vite和React 18。