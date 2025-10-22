const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function readCommitMessage(msgPath) {
  try {
    if (msgPath && fs.existsSync(msgPath)) {
      return fs.readFileSync(msgPath, 'utf8').trim();
    }
  } catch (_) {}
  try {
    return execSync('git log -1 --pretty=%B').toString().trim();
  } catch (_) {
    return '';
  }
}

function ensureChangelogHeader(content) {
  if (!content.startsWith('# Changelog')) {
    return '# Changelog\n\n' + content;
  }
  // 确保标题后至少有一空行
  const lines = content.split('\n');
  if (lines.length > 1 && lines[1].trim() !== '') {
    lines.splice(1, 0, '');
    return lines.join('\n');
  }
  return content;
}

function buildEntry(message) {
  const lines = (message || '').split('\n');
  const subject = (lines[0] || '').trim();
  const body = lines.slice(1).join('\n').trim();
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  let entry = `- ${stamp} ${subject}\n`;
  if (body) {
    entry += `  ${body.replace(/\n/g, '\n  ')}\n`;
  }
  return entry + '\n';
}

function alreadyHasEntry(content, subject) {
  const headChunk = content.slice(0, 400); // 检查顶部一段，避免重复追加
  return headChunk.includes(subject);
}

function run(msgPath) {
  const changelogPath = path.join(__dirname, '../CHANGELOG.md');
  let changelog = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '';
  changelog = ensureChangelogHeader(changelog);

  const message = readCommitMessage(msgPath);
  if (!message) return; // 无消息则跳过

  const subject = (message.split('\n')[0] || '').trim();
  // 跳过 release 类提交（standard-version 会写入自己的条目）
  if (/^chore\(release\)/i.test(subject)) {
    return;
  }

  if (alreadyHasEntry(changelog, subject)) {
    return; // 已经有同条目，避免重复
  }

  const entry = buildEntry(message);

  // 插入到标题后面
  const idx = changelog.indexOf('# Changelog');
  const before = changelog.slice(0, idx + '# Changelog'.length);
  const after = changelog.slice(idx + '# Changelog'.length).replace(/^\n*/, '');
  const next = `${before}\n\n${entry}${after}`;

  fs.writeFileSync(changelogPath, next, 'utf8');

  // 加入暂存以纳入本次提交
  try {
    execSync(`git add ${changelogPath}`);
  } catch (_) {}
}

run(process.argv[2]);