#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const projects = ['pdf-viewer', 'redux-toolkit-demo', 'step-form', 'my-new-app'];

console.log('验证所有项目是否能正常构建...\n');

let successCount = 0;
const totalProjects = projects.length;

for (const project of projects) {
  try {
    console.log(`正在构建 ${project}...`);
    execSync(`pnpm --filter ./vite-project/${project} build`, {
      stdio: 'inherit',
    });
    console.log(`✅ ${project} 构建成功!\n`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${project} 构建失败!`);
    console.error(error.message);
  }
}

console.log(`\n构建完成: ${successCount}/${totalProjects} 个项目成功构建`);

if (successCount === totalProjects) {
  console.log('🎉 所有项目都成功构建!');
  process.exit(0);
} else {
  console.log('⚠️  部分项目构建失败');
  process.exit(1);
}