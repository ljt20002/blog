import React from 'react';
import styles from './index.module.less';
import { useI18n } from '@/i18n';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>© {currentYear} {t('site.title')}</div>
      </div>
    </footer>
  );
};

export default Footer;
