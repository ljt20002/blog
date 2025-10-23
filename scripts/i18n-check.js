#!/usr/bin/env node
/**
 * i18n-check.js
 * 1) 扫描 src 下 TS/TSX，禁止硬编码 UI 文案（JSXText、JSXAttribute 直接字符串）
 * 2) 收集 t()/tRaw() 的键，校验中英文词典同时存在
 * 3) 输出文件和行列信息；发现问题退出码为 1
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const SRC_DIR = path.resolve(__dirname, '..', 'src');
const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'i18n', 'locales');
const ZH_FILE = path.join(LOCALES_DIR, 'zh-CN.json');
const EN_FILE = path.join(LOCALES_DIR, 'en-US.json');

const UI_DIRS = [
  path.join(SRC_DIR, 'components'),
  path.join(SRC_DIR, 'layout'),
  path.join(SRC_DIR, 'pages'),
  path.join(SRC_DIR, 'App.tsx'),
];

// 允许直接字符串的属性（非用户可见）
const SAFE_ATTRS = new Set([
  'className', 'id', 'key', 'role', 'type', 'name', 'value', 'href', 'src', 'rel', 'target',
  'width', 'height', 'cols', 'rows', 'draggable', 'tabIndex', 'data-testid',
  // 常见非用户可见 UI 枚举/配置
  'direction', 'size', 'layout', 'loading', 'sandbox', 'referrerPolicy', 'to', 'position', 'shape'
]);

// 需要强制国际化的属性（用户可见/可感知）
const ENFORCE_ATTRS = new Set([
  'title', 'alt', 'placeholder', 'aria-label', 'ariaDescription', 'aria-roledescription'
]);

const isTSLike = (p) => /\.(tsx?|jsx?)$/.test(p);
const shouldScan = (abs) => {
  if (abs.includes(path.sep + 'i18n' + path.sep)) return false;
  if (abs.includes(path.sep + 'utils' + path.sep)) return false;
  if (abs.includes(path.sep + 'scripts' + path.sep)) return false;
  return isTSLike(abs);
};

function walk(dir, acc = []) {
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (shouldScan(dir)) acc.push(dir);
    return acc;
  }
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, acc); else if (shouldScan(p)) acc.push(p);
  }
  return acc;
}

function loadJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function posOf(sf, node) {
  const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart());
  return `${line + 1}:${character + 1}`;
}

function isNonTrivialText(text) {
  const s = text.replace(/\s+/g, ' ').trim();
  if (!s) return false; // 空白
  // 排除仅符号
  if (/^[~`!@#$%^&*()_+\-={}\[\]|;:'",.<>/?\\]+$/.test(s)) return false;
  return /[A-Za-z\u4e00-\u9fff]/.test(s);
}

function hasI18nIgnore(sf, node) {
  const text = sf.getFullText();
  const start = node.getFullStart();
  const ranges = ts.getLeadingCommentRanges ? ts.getLeadingCommentRanges(text, start) : [];
  if (!ranges) return false;
  return ranges.some((r) => text.slice(r.pos, r.end).includes('i18n-ignore'));
}

function scanFile(file, usedKeys, violations) {
  const code = fs.readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

  function visit(node) {
    // 收集 t()/tRaw() 的键
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const isT = ts.isIdentifier(callee) && (callee.text === 't' || callee.text === 'tRaw');
      if (isT && node.arguments.length > 0 && ts.isStringLiteral(node.arguments[0])) {
        usedKeys.add(node.arguments[0].text);
      }
    }

    // JSX 纯文本直接硬编码
    if (ts.isJsxText(node)) {
      if (!hasI18nIgnore(sf, node)) {
        const raw = node.getText();
        if (isNonTrivialText(raw)) {
          violations.push({ file, pos: posOf(sf, node), type: 'JSXText', text: raw.trim() });
        }
      }
    }

    // JSX 属性字符串
    if (ts.isJsxAttribute(node)) {
      if (!hasI18nIgnore(sf, node)) {
        const name = node.name.escapedText.toString();
        const init = node.initializer;
        if (init && (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init))) {
          const val = init.text;
          const isSafe = SAFE_ATTRS.has(name) || name.startsWith('data-');
          if (!isSafe) {
            // 如果是强制属性则一定违规；否则用启发式判定文本性
            const must = ENFORCE_ATTRS.has(name);
            const looksText = must || isNonTrivialText(val);
            if (looksText) {
              violations.push({ file, pos: posOf(sf, node), type: `JSXAttribute:${name}`, text: val });
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);
}

function main() {
  const zh = loadJSON(ZH_FILE);
  const en = loadJSON(EN_FILE);

  const files = UI_DIRS.flatMap((p) => walk(p, []));
  const usedKeys = new Set();
  const violations = [];

  for (const f of files) {
    scanFile(f, usedKeys, violations);
  }

  // 词典对齐校验
  const zhKeys = new Set(Object.keys(zh));
  const enKeys = new Set(Object.keys(en));
  const missingInZh = [...enKeys].filter((k) => !zhKeys.has(k));
  const missingInEn = [...zhKeys].filter((k) => !enKeys.has(k));

  const missingUsedInZh = [...usedKeys].filter((k) => !zhKeys.has(k));
  const missingUsedInEn = [...usedKeys].filter((k) => !enKeys.has(k));

  let hasError = false;
  if (violations.length) {
    console.error(`\n[UI 文案未国际化] 共 ${violations.length} 处:`);
    for (const v of violations) {
      console.error(` - ${v.file}:${v.pos} [${v.type}] => "${v.text}"`);
    }
    hasError = true;
  }

  if (missingInZh.length || missingInEn.length) {
    if (missingInZh.length) {
      console.error(`\n[词典缺失] 英文有而中文缺失共 ${missingInZh.length} 个键:`);
      for (const k of missingInZh) console.error(` - ${k}`);
    }
    if (missingInEn.length) {
      console.error(`\n[词典缺失] 中文有而英文缺失共 ${missingInEn.length} 个键:`);
      for (const k of missingInEn) console.error(` - ${k}`);
    }
    hasError = true;
  }

  if (missingUsedInZh.length || missingUsedInEn.length) {
    if (missingUsedInZh.length) {
      console.error(`\n[键未翻译] 代码引用但中文缺失共 ${missingUsedInZh.length} 个键:`);
      for (const k of missingUsedInZh) console.error(` - ${k}`);
    }
    if (missingUsedInEn.length) {
      console.error(`\n[键未翻译] 代码引用但英文缺失共 ${missingUsedInEn.length} 个键:`);
      for (const k of missingUsedInEn) console.error(` - ${k}`);
    }
    hasError = true;
  }

  if (hasError) {
    console.error(`\n❌ i18n 检查失败，请用 t('...') 替换硬编码，并补齐词典。`);
    process.exit(1);
  } else {
    console.log(`\n✅ i18n 检查通过：未发现硬编码文案，词典双语对齐。`);
  }
}

main();