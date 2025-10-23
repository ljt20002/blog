import mdFiles from '../mdFiles';
import { Message } from '@arco-design/web-react';
import { tRaw } from '@/i18n';

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
      return { data: {}, content: tRaw('blog.html.placeholder') };
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
      console.error(tRaw('blog.noMarkdown'));
      return [];
    }

    const postsData = await Promise.all(
      fileNames.map(async (fileName) => {
        try {
          // 修改路径，确保能正确获取文件
          const fileResponse = await fetch(`${window.location.origin}/posts/${fileName}`);
          if (!fileResponse.ok) {
            throw new Error(`Failed to fetch: ${fileName}`);
          }

          const content = await fileResponse.text();
          const { data, content: markdownContent } = parseFrontMatter(content);
          // 提取第一段落作为摘要，确保不是HTML代码
          let firstParagraph = markdownContent.split('\n').find((line) => line.trim() !== '');

          // 如果摘要看起来像HTML代码，则使用替代文本
          if (firstParagraph?.trim().startsWith('<') && firstParagraph.includes('</')) {
            firstParagraph = tRaw('blog.html.summaryFallback');
          }

          return {
            id: fileName.replace(/\.md$/, ''),
            title: data.title || tRaw('blog.titleDefault'),
            date: data.date ? new Date(data.date).toISOString().split('T')[0] : tRaw('blog.dateUnknown'),
            author: data.author || tRaw('blog.authorAnonymous'),
            tags: Array.isArray(data.tags) ? data.tags : [],
            summary: firstParagraph || tRaw('blog.summaryNone'),
          };
        } catch (err) {
          console.error(tRaw('blog.fetchPostsError'), err);
          return null;
        }
      }),
    );

    const filteredPosts = postsData.filter(Boolean) as BlogPost[];

    // 如果指定了限制数量，则返回指定数量的文章
    return limit ? filteredPosts.slice(0, limit) : filteredPosts;
  } catch (error) {
    console.error(tRaw('blog.fetchPostsError'), error);
    Message.error(tRaw('blog.listError'));
    return [];
  }
};
