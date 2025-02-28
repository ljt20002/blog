import { Link } from 'react-router-dom';
import styles from './index.module.less';

const NotFound = () => (
  <div className={styles.notFound}>
    <h1>404</h1>
    <p>页面未找到</p>
    <Link to="/">返回首页</Link>
  </div>
);

export default NotFound;
