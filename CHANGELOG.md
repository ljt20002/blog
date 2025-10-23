# Changelog

- 2025-10-23 00:24 feat(i18n): 添加国际化检查脚本和提交卡点
  添加 i18n-check.js 脚本用于检查硬编码文案和词典双语对齐
  在 pre-commit 钩子中增加国际化检查
  更新 README 说明国际化开发规范
  添加 avatarAlt 翻译键并替换硬编码文案

- 2025-10-22 23:55 feat(i18n): 添加多语言支持功能
  实现应用国际化支持，包括：
  - 添加i18n上下文提供器和hook
  - 创建中英文语言包
  - 重构组件使用翻译文本
  - 添加语言切换组件
  - 更新样式和布局适应多语言需求

- 2025-10-22 22:24 feat(主题): 实现暗黑模式主题切换功能
  添加主题切换组件和返回顶部组件
  引入CSS变量实现主题颜色切换
  更新各组件样式使用CSS变量

- 2025-10-22 07:56 refactor(Detail): 使用 iframe 替代直接渲染 HTML 内容
  重构详情页实现方式，将直接渲染 HTML 内容改为通过 iframe 加载，避免潜在的 XSS 风险并简化代码逻辑

- 2025-10-22 17:23 fix(hooks): 在post-commit钩子中添加--no-verify选项避免循环触发钩子

- 2025-10-22 17:11 docs: 更新 CHANGELOG 以记录最近的变更

- 2025-10-22 17:04 chore: 添加自动更新 CHANGELOG 的 husky 钩子和脚本
  添加 prepare-commit-msg 钩子用于在提交前自动将提交信息写入 CHANGELOG
  移除不再使用的 post-commit 钩子
  新增 append-changelog.js 脚本处理 CHANGELOG 更新逻辑

