import React from 'react';
import styles from './index.module.less';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>© {currentYear} 嘉图的网络日志</div>
      </div>
    </footer>
  );
};

export default Footer;
