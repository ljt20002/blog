import mdFiles from '../mdFiles';
import { Message } from '@arco-design/web-react';

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  summary: string;
}

// 解析front matter的函数
export const parseFrontMatter = (content: string) => {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    // 检测是否为HTML内容
    if (content.trim().startsWith('<') && content.includes('</')) {
      // 如果是HTML内容，提取纯文本或使用占位符
      return { data: {}, content: '这是一篇HTML格式的文章' };
    }
    return { data: {}, content };
  }

  const frontMatter = match[1];
  const contentBody = match[2];

  // 简单解析YAML格式的front matter
  const data: Record<string, any> = {};
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
};

// 获取博客文章的公共函数
export const fetchBlogPosts = async (limit?: number) => {
  try {
    // 使用生成的mdFiles获取文件列表
    const fileNames = Object.keys(mdFiles).map(
      (path) =>
        // 从路径中提取文件名
        path.split('/').pop() || '',
    );

    if (fileNames.length === 0) {
      console.error('没有找到Markdown文件');
      return [];
    }

    const postsData = await Promise.all(
      fileNames.map(async (fileName) => {
        try {
          // 修改路径，确保能正确获取文件
          const fileResponse = await fetch(`${window.location.origin}/posts/${fileName}`);
          if (!fileResponse.ok) {
            throw new Error(`无法获取文件: ${fileName}`);
          }

          const content = await fileResponse.text();
          const { data, content: markdownContent } = parseFrontMatter(content);
          // 提取第一段落作为摘要，确保不是HTML代码
          let firstParagraph = markdownContent.split('\n').find((line) => line.trim() !== '');

          // 如果摘要看起来像HTML代码，则使用替代文本
          if (firstParagraph?.trim().startsWith('<') && firstParagraph.includes('</')) {
            firstParagraph = '这是一篇博客文章，点击查看详情';
          }

          return {
            id: fileName.replace(/\.md$/, ''),
            title: data.title || '无标题',
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : '未知日期',
            author: data.author || '匿名',
            tags: Array.isArray(data.tags) ? data.tags : [],
            summary: firstParagraph || '无摘要',
          };
        } catch (err) {
          console.error(`处理文件 ${fileName} 时出错:`, err);
          return null;
        }
      }),
    );

    const filteredPosts = postsData.filter(Boolean) as BlogPost[];

    // 如果指定了限制数量，则返回指定数量的文章
    return limit ? filteredPosts.slice(0, limit) : filteredPosts;
  } catch (error) {
    console.error('获取博客文章失败:', error);
    Message.error('获取博客列表失败');
    return [];
  }
};
