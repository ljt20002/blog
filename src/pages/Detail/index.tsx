import styles from './index.module.less';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/default.css';

const Detail = () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHtml = async () => {
      if (!id) {
        setError('未找到文章 ID');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/md/${id}.html`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`加载失败：${res.status}`);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const article = doc.querySelector('article');
        const raw = article ? article.outerHTML : doc.body ? doc.body.innerHTML : text;
        const clean = DOMPurify.sanitize(raw);
        setHtml(clean);
      } catch (err: any) {
        setError(err?.message || '加载文章失败');
      } finally {
        setLoading(false);
      }
    };
    fetchHtml();
  }, [id]);

  if (loading) return <div className={styles.detail}>加载中...</div>;
  if (error) return <div className={styles.detail}>错误：{error}</div>;

  return (
    <div className={styles.detail}>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default Detail;
