const fs = require('fs');
const path = require('path');

// 解析front matter的函数
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    // 检测是否为HTML内容
    if (content.trim().startsWith('<') && content.includes('</')) {
      return { data: {}, content: '这是一篇HTML格式的文章' };
    }
    return { data: {}, content };
  }

  const frontMatter = match[1];
  const contentBody = match[2];

  // 简单解析YAML格式的front matter
  const data = {};
  frontMatter.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim();
      // 处理数组格式，如tags: [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key.trim()] = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim());
      } else {
        data[key.trim()] = value;
      }
    }
  });

  return { data, content: contentBody };
}

// 生成博客文件和元数据
function generateBlogFiles() {
  const postsDir = path.join(__dirname, '../posts');
  const outputPath = path.join(__dirname, '../src/mdFiles.ts');

  try {
    // 读取目录中的所有文件
    const files = fs.readdirSync(postsDir);

    // 过滤出.md文件
    const mdFiles = files.filter((file) => file.endsWith('.md'));

    // 创建一个对象，用于存储所有博客文章的元数据
    const blogMetadata = {};
    const mdFilesObj = {};

    // 处理每个Markdown文件
    mdFiles.forEach((fileName) => {
      try {
        // 读取文件内容
        const filePath = path.join(postsDir, fileName);
        const content = fs.readFileSync(filePath, 'utf-8');

        // 解析front matter和内容
        const { data, content: markdownContent } = parseFrontMatter(content);

        // 提取第一段落作为摘要，确保不是HTML代码
        let firstParagraph = markdownContent.split('\n').find((line) => line.trim() !== '');

        // 如果摘要看起来像HTML代码，则使用替代文本
        if (firstParagraph?.trim().startsWith('<') && firstParagraph.includes('</')) {
          firstParagraph = '这是一篇博客文章，点击查看详情';
        }

        // 创建博客文章元数据对象
        const postId = fileName.replace(/\.md$/, '');
        blogMetadata[postId] = {
          id: postId,
          title: data.title || '无标题',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '未知日期',
          author: data.author || '匿名',
          tags: Array.isArray(data.tags) ? data.tags : [],
          summary: firstParagraph || '无摘要',
          filePath: `md/${postId}.html`,
        };

        // 添加到mdFiles对象
        mdFilesObj[`posts/${fileName}`] = true;
      } catch (err) {
        console.error(`处理文件 ${fileName} 时出错:`, err);
      }
    });

    // 生成JavaScript代码
    const jsContent = `// 此文件由脚本自动生成，请勿手动修改
// 最后更新时间: ${new Date().toISOString()}

// 博客文章元数据
const blogMetadata = ${JSON.stringify(blogMetadata, null, 2)};

// 兼容旧版本的mdFiles对象
const mdFiles = ${JSON.stringify(mdFilesObj, null, 2)};

export default mdFiles;
export { blogMetadata };
`;

    // 写入文件
    fs.writeFileSync(outputPath, jsContent);

    console.log(`已成功生成博客文件: ${outputPath}`);
    return { blogMetadata, mdFiles: mdFilesObj };
  } catch (error) {
    console.error('生成博客文件时出错:', error);
    return { blogMetadata: {}, mdFiles: {} };
  }
}

// 执行函数
generateBlogFiles();
