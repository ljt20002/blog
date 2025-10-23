import { Link } from 'react-router-dom';
import styles from './index.module.less';
import { useI18n } from '@/i18n';

const NotFound = () => {
  const { t } = useI18n();
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <p>{t('notFound.title')}</p>
      <Link to="/home">{t('notFound.backHome')}</Link>
    </div>
  );
};

export default NotFound;
