const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const marked = require('marked');
const matter = require('gray-matter');

// 配置 marked 高亮与选项
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
  gfm: true,
});

const postsDir = path.join(__dirname, '../posts');
const outputHtmlDir = path.join(__dirname, '../public/md');
const mdFilesTsPath = path.join(__dirname, '../src/mdFiles.ts');
const validateOnly = process.argv.includes('--validate-only');

mkdirp.sync(outputHtmlDir);

function extractSummary(markdownContent) {
  const firstNonEmpty = (markdownContent || '')
    .split('\n')
    .map((s) => s.trim())
    .find((line) => line.length > 0);
  return {
    summary: firstNonEmpty || '这是一篇博客文章，点击查看详情',
    valid: !!firstNonEmpty,
  };
}

function validateFrontMatter(data, summaryValid) {
  const errors = [];

  // 校验 date（兼容字符串与 Date 对象）
  if (!data.date) {
    errors.push('date 必须存在');
  } else if (typeof data.date === 'string') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      errors.push('date 必须是 YYYY-MM-DD 格式');
    } else {
      const d = new Date(data.date);
      if (Number.isNaN(d.getTime())) {
        errors.push('date 不是有效日期');
      }
    }
  } else if (!(data.date instanceof Date)) {
    errors.push('date 类型不支持，请使用 YYYY-MM-DD 字符串');
  }

  // 校验 tags
  if (!Array.isArray(data.tags)) {
    errors.push('tags 需用方括号数组格式，例如 [标签1, 标签2]');
  }

  // 校验摘要
  if (!summaryValid) {
    errors.push('正文需至少包含一段非空文本，用作列表页摘要');
  }

  return errors;
}

function buildHtml({ title, date, author, tags, contentHtml }) {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || '博客文章'}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/default.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    img { max-width: 100%; height: auto; }
    code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 4px; }
    pre { background-color: #f5f5f5; padding: 16px; border-radius: 4px; overflow: auto; }
    blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin-left: 0; color: #666; }
    .post-meta { color: #666; margin-bottom: 24px; }
    .post-tag { display: inline-block; background-color: #e6f7ff; color: #1890ff; padding: 2px 8px; border-radius: 4px; margin-right: 8px; font-size: 14px; }
  </style>
</head>
<body>
  <article>
    <header>
      <h1>${title || '博客文章'}</h1>
      <div class="post-meta">
        <span>发布日期: ${date || '未知日期'}</span>
        <span> | 作者: ${author || '匿名'}</span>
      </div>
      <div>
        ${(tags || []).map((tag) => `<span class="post-tag">${tag}</span>`).join('')}
      </div>
    </header>
    ${contentHtml}
  </article>
</body>
</html>`;
}

function run() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  const allErrors = [];
  const postsData = [];

  files.forEach((fileName) => {
    const filePath = path.join(postsDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const { data, content } = matter(fileContent);
    const { summary, valid: summaryValid } = extractSummary(content);

    const errors = validateFrontMatter(data, summaryValid);
    if (errors.length) {
      allErrors.push({ file: fileName, errors });
      return; // 仍记录但不构建该文件
    }

    // 标准化日期为 YYYY-MM-DD
    const normalizedDate = new Date(data.date).toISOString().split('T')[0];

    // 转换 Markdown 为 HTML
    const contentHtml = marked.parse(content);
    const html = buildHtml({
      title: data.title || '无标题',
      date: normalizedDate || '未知日期',
      author: data.author || '匿名',
      tags: Array.isArray(data.tags) ? data.tags : [],
      contentHtml,
    });

    const postId = fileName.replace(/\.md$/, '');

    postsData.push({
      id: postId,
      title: data.title || '无标题',
      date: normalizedDate || '未知日期',
      author: data.author || '匿名',
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary,
      html,
      fileName,
    });
  });

  if (allErrors.length) {
    console.error('\n文章校验失败：');
    allErrors.forEach(({ file, errors }) => {
      console.error(`- ${file}`);
      errors.forEach((e) => console.error(`  • ${e}`));
    });
    process.exit(1);
  }

  // 仅校验模式，直接退出成功
  if (validateOnly) {
    console.log('校验通过：所有文章符合规范');
    return;
  }

  // 写入 HTML 文件
  postsData.forEach((post) => {
    const outputPath = path.join(outputHtmlDir, `${post.id}.html`);
    fs.writeFileSync(outputPath, post.html, 'utf8');
    console.log(`已生成HTML文件: ${outputPath}`);
  });

  // 构建 blogMetadata 与 mdFiles
  const blogMetadata = {};
  const mdFilesObj = {};

  postsData.forEach((post) => {
    blogMetadata[post.id] = {
      id: post.id,
      title: post.title,
      date: post.date,
      author: post.author,
      tags: post.tags,
      summary: post.summary,
      filePath: `md/${post.id}.html`,
    };
    mdFilesObj[`posts/${post.fileName}`] = true;
  });

  const tsContent = `// 此文件由脚本自动生成，请勿手动修改\n// 最后更新时间: ${new Date().toISOString()}\n\n// 博客文章元数据\nconst blogMetadata = ${JSON.stringify(blogMetadata, null, 2)};\n\n// 兼容旧版本的mdFiles对象\nconst mdFiles = ${JSON.stringify(mdFilesObj, null, 2)};\n\nexport default mdFiles;\nexport { blogMetadata };\n`;

  fs.writeFileSync(mdFilesTsPath, tsContent, 'utf8');
  console.log(`已成功生成博客文件: ${mdFilesTsPath}`);
}

try {
  run();
} catch (err) {
  console.error('构建文章时发生错误：', err);
  process.exit(1);
}