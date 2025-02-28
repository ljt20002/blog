import styles from './index.module.less';
import { useEffect, useRef } from 'react';

const Detail = () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        // 设置 iframe 的高度为其内容的高度
        const height = iframeRef.current.contentWindow?.document.documentElement.scrollHeight;
        if (height) {
          iframeRef.current.style.height = `${height + 10}px`;
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
    <div className={styles.detail}>
      <iframe ref={iframeRef} src={`/md/${id}.html`} />
    </div>
  );
};

export default Detail;
