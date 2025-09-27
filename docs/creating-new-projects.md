# 创建新项目

本文档说明如何在monorepo中创建新项目。

## 创建新的Vite React应用

1. 在 `vite-project` 目录下创建新项目文件夹：
   ```bash
   mkdir vite-project/your-project-name
   ```

2. 进入新项目目录并初始化Vite应用：
   ```bash
   cd vite-project/your-project-name
   pnpm create vite@latest . --template react
   ```

3. 安装依赖：
   ```bash
   pnpm install
   ```

4. 更新根目录的 README.md 文件，添加新项目的说明。

5. 更新 `scripts/verify-projects.js` 文件，将新项目添加到验证列表中。

## 创建共享包

1. 在 `packages` 目录下创建新包：
   ```bash
   mkdir packages/your-package-name
   ```

2. 初始化包：
   ```bash
   cd packages/your-package-name
   pnpm init
   ```

3. 实现包的功能。

4. 在需要使用该包的项目中添加依赖：
   ```bash
   pnpm --filter your-project-name add your-package-name --workspace
   ```

## 项目结构约定

- `vite-project/` - 存放所有使用Vite构建的前端应用
- `packages/` - 存放可共享的库、组件包或工具包

## 常用命令

```bash
# 安装所有依赖
pnpm install

# 启动特定项目
pnpm --filter project-name dev

# 构建特定项目
pnpm --filter project-name build

# 在所有项目中运行命令
pnpm -r command

# 验证所有项目构建
pnpm verify
```