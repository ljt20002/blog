import styles from './index.module.less';
import { useEffect, useRef } from 'react';

const Detail = () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current && detailRef.current) {
        // 设置 iframe 的高度为其内容的高度
        const height = iframeRef.current.contentWindow?.document.documentElement.scrollHeight;
        if (height) {
          iframeRef.current.style.height = `${height + 50}px`;
          detailRef.current.style.height = `${height + 50}px`;
        }
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  return (
    <div className={styles.detail} ref={detailRef}>
      <iframe
        ref={iframeRef}
        src={`/md/${id}.html`}
        title="文章详情"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default Detail;
