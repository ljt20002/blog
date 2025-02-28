const { execSync } = require('child_process');
const inquirer = require('inquirer');

const commitTypes = [
  { name: 'feat     ✨ 新功能', value: 'feat' },
  { name: 'fix      🐛 Bug 修复', value: 'fix' },
  { name: 'docs     📝 文档', value: 'docs' },
  { name: 'style    💄 样式', value: 'style' },
  { name: 'refactor ♻️ 重构', value: 'refactor' },
  { name: 'perf     ⚡️ 性能优化', value: 'perf' },
  { name: 'test     ✅ 测试', value: 'test' },
  { name: 'chore    🔧 其他', value: 'chore' },
];

async function main() {
  try {
    // 执行 git add .
    execSync('git add .', { stdio: 'inherit' });
    console.log('\n执行 git add . 成功\n');
    execSync('git status', { stdio: 'inherit' });

    // 选择提交类型
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '请选择提交类型:',
        choices: commitTypes,
      },
    ]);

    // 输入提交信息
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: '请输入提交信息:',
      },
    ]);

    // 执行 git commit
    const commitCommand = `git commit -m "${type}: ${message}"`;
    execSync(commitCommand, { stdio: 'inherit' });
    console.log('\n提交成功！');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
