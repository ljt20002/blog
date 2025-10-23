# Rsbuild Project

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## i18n 开发约束与提交卡点

- 所有用户可见文案必须使用 `t('...')` 或 `tRaw('...')`。
- 禁止在 JSX 中直接硬编码文本：
  - 直接的 `JSXText`（例如 `<span>文本</span>`）会被拦截。
  - 需要国际化的属性直接字符串也会被拦截：`title`、`alt`、`placeholder`、`aria-label/ariaDescription/aria-roledescription`。
- 允许不需国际化的属性：`className`、`id`、`key`、`role`、`type`、`name`、`value`、`href`、`src`、`rel`、`target`、`width/height`、`cols/rows`、`draggable`、`tabIndex`、`data-*`。
- 词典双语对齐：凡代码里出现的键，必须同时存在于 `src/i18n/locales/zh-CN.json` 与 `en-US.json`。

运行检查：

```bash
pnpm i18n:check
```

提交流程：
- `pre-commit` 会自动运行 i18n 检查；失败会拒绝提交。

可扩展点：
- 调整扫描目录：编辑 `scripts/i18n-check.js` 中的 `UI_DIRS`。
- 修改属性白名单或强制名单：编辑 `SAFE_ATTRS` 与 `ENFORCE_ATTRS`。
- 新增词典键：在两种语言的 JSON 中同时添加相同键，值分别填写对应翻译。
