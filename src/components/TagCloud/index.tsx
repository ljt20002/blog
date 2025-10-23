import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogMetadata } from '../../mdFiles';
import styles from './index.module.less';
import { useI18n } from '@/i18n';

const TagCloud: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  // 统计所有标签及其出现次数
  const tags = useMemo(() => {
    const tagMap: Record<string, number> = {};

    Object.values(blogMetadata).forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      }
    });

    // 转换为数组并排序
    return Object.entries(tagMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // 根据标签数量计算字体大小
  const getTagSize = (count: number) => {
    const maxCount = Math.max(...tags.map((tag) => tag.count));
    const minSize = 12; // 最小字体大小
    const maxSize = 16; // 最大字体大小，减小了

    if (maxCount === 1) {
      return minSize;
    }
    const size = minSize + ((maxSize - minSize) * (count - 1)) / (maxCount - 1);
    return Math.round(size);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/home?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className={styles.tagCloud}>
      <div className={styles.tagTitle}>{t('tag.title')}</div>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span
            key={tag.name}
            className={styles.tag}
            style={{ fontSize: `${getTagSize(tag.count)}px` }}
            onClick={() => handleTagClick(tag.name)}
          >
            {tag.name} ({tag.count})
          </span>
        ))}
        {tags.length === 0 && <span>{t('tag.empty')}</span>}
      </div>
    </div>
  );
};

export default TagCloud;
