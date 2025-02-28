import { Card, Typography, Space, Divider } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.less';
import { BlogPost } from '../../utils/blogUtils';
import { blogMetadata } from '../../mdFiles';

const { Title, Paragraph } = Typography;

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    try {
      const postsData = Object.values(blogMetadata);
      const selectedDate = searchParams.get('date');
      const searchQuery = searchParams.get('search');

      // 根据条件筛选文章
      let filteredPosts = postsData;

      // 按日期筛选
      if (selectedDate) {
        filteredPosts = filteredPosts.filter((post) => post.date === selectedDate);
      }

      // 按搜索关键词筛选
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filteredPosts = filteredPosts.filter(
          (post) => post.title.toLowerCase().includes(query) || post.summary.toLowerCase().includes(query),
        );
      }

      // 按日期排序（最新的在前面）
      const sortedPosts = filteredPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10); // 增加显示数量，因为搜索结果可能较多

      setFeaturedPosts(sortedPosts);
    } catch (error) {
      console.error('获取博客文章失败:', error);
    }
  }, [searchParams]); // 依赖于 searchParams

  const handlePostClick = (postId: string) => {
    navigate(`/detail?id=${postId}`);
  };

  // 渲染搜索结果标题
  const renderResultTitle = () => {
    const searchQuery = searchParams.get('search');
    const selectedDate = searchParams.get('date');

    if (searchQuery) {
      return `搜索结果: "${searchQuery}"`;
    } else if (selectedDate) {
      return `${selectedDate} 的文章`;
    } else {
      return '精选文章';
    }
  };

  return (
    <div className={styles.homeContainer}>
      <Card className={styles.welcomeCard}>
        <Title heading={2}>嘉图的网络日志</Title>
        <Paragraph>欢迎来到我的博客！这里记录了我对技术、生活和各种有趣话题的思考。</Paragraph>
      </Card>

      <Divider />

      <div className={styles.featuredPosts}>
        <Title heading={4}>{renderResultTitle()}</Title>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post) => (
              <Card key={post.id} hoverable className={styles.postCard} onClick={() => handlePostClick(post.id)}>
                <Title heading={5}>{post.title}</Title>
                <Paragraph type="secondary">{post.date}</Paragraph>
                <Paragraph ellipsis={{ rows: 3 }}>{post.summary}</Paragraph>
              </Card>
            ))
          ) : (
            <Card className={styles.postCard}>
              <Paragraph
                style={{
                  marginBottom: 0,
                }}
              >
                没有找到相关文章
              </Paragraph>
            </Card>
          )}
        </Space>
      </div>
    </div>
  );
};

export default Home;
