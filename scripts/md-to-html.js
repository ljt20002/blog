const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');
const mkdirp = require('mkdirp');

// 配置marked选项
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false,
});

// 源目录和目标目录
const postsDir = path.join(__dirname, '../public/posts');
const outputDir = path.join(__dirname, '../public/md');

// 确保输出目录存在
mkdirp.sync(outputDir);

// 处理单个Markdown文件
function processMarkdownFile(filePath, outputPath) {
  try {
    // 读取Markdown文件
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // 解析front matter
    const { data, content } = matter(fileContent);

    // 将Markdown转换为HTML
    const htmlContent = marked.parse(content);

    // 创建完整的HTML文档
    const fullHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title || '博客文章'}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/default.min.css">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 4px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      overflow: auto;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 16px;
      margin-left: 0;
      color: #666;
    }
    .post-meta {
      color: #666;
      margin-bottom: 24px;
    }
    .post-tag {
      display: inline-block;
      background-color: #e6f7ff;
      color: #1890ff;
      padding: 2px 8px;
      border-radius: 4px;
      margin-right: 8px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <article>
    <header>
      <h1>${data.title || '博客文章'}</h1>
      <div class="post-meta">
        <span>发布日期: ${data.date || '未知日期'}</span>
        <span> | 作者: ${data.author || '匿名'}</span>
      </div>
      <div>
        ${(data.tags || []).map((tag) => `<span class="post-tag">${tag}</span>`).join('')}
      </div>
    </header>
    ${htmlContent}
  </article>
</body>
</html>
    `;

    // 写入HTML文件
    fs.writeFileSync(outputPath, fullHtml, 'utf8');
    console.log(`已生成HTML文件: ${outputPath}`);
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 处理所有Markdown文件
function processAllMarkdownFiles() {
  try {
    // 读取posts目录中的所有文件
    const files = fs.readdirSync(postsDir);

    // 过滤出.md文件
    const markdownFiles = files.filter((file) => path.extname(file).toLowerCase() === '.md');

    // 处理每个Markdown文件
    markdownFiles.forEach((file) => {
      const filePath = path.join(postsDir, file);
      const outputFileName = `${path.basename(file, '.md')}.html`;
      const outputPath = path.join(outputDir, outputFileName);

      processMarkdownFile(filePath, outputPath);
    });

    console.log(`共处理了 ${markdownFiles.length} 个Markdown文件`);
  } catch (error) {
    console.error('处理Markdown文件时出错:', error);
  }
}

// 执行转换
processAllMarkdownFiles();
