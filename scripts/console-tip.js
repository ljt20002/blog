const { execSync } = require('child_process');

try {
  // 执行 git add .
  execSync('git add .', { stdio: 'inherit' });
  console.log('\n执行 git add. 成功\n');
  execSync('git status', { stdio: 'inherit' });
  // 输出提交类型提示
  console.log(`可用的提交类型：
    feat     ✨ 新功能
    fix      🐛 Bug 修复
    docs     📝 文档
    style    💄 样式
    refactor ♻️ 重构
    perf     ⚡️ 性能优化
    test     ✅ 测试
    chore    🔧 其他
提交格式示例：
    git commit -m "feat: 添加新功能"`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
