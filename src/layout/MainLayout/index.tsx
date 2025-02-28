import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Nav from '../Nav';
import Sidebar from '../Sidebar';
import styles from './index.module.less';
import Footer from '../Footer';
import TextTranslator from '@/components/TextTranslator';
const MainLayout = () => (
  <div>
    <Header />
    <Nav />
    <div className={styles.MainLayout}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <Outlet />
        </div>
        <Sidebar />
      </div>
    </div>
    <Footer />
    <TextTranslator />
  </div>
);

export default MainLayout;
