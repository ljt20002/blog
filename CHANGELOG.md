# Changelog

- 2025-10-22 17:23 fix(hooks): 在post-commit钩子中添加--no-verify选项避免循环触发钩子

- 2025-10-22 17:11 docs: 更新 CHANGELOG 以记录最近的变更

- 2025-10-22 17:04 chore: 添加自动更新 CHANGELOG 的 husky 钩子和脚本
  添加 prepare-commit-msg 钩子用于在提交前自动将提交信息写入 CHANGELOG
  移除不再使用的 post-commit 钩子
  新增 append-changelog.js 脚本处理 CHANGELOG 更新逻辑

