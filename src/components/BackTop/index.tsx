import { useEffect, useState } from 'react';
import { Button } from '@arco-design/web-react';
import { IconUp } from '@arco-design/web-react/icon';
import styles from './index.module.less';

const BackTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          setVisible(scrollTop > 200);
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初始化判断
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.backTop}>
      <Button shape="circle" type="primary" aria-label="返回顶部" onClick={scrollToTop}>
        <IconUp />
      </Button>
    </div>
  );
};

export default BackTop;