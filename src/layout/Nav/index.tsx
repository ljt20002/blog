import { contentRoutes } from '@/routes';
import styles from './index.module.less';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggleInline from '@/components/ThemeToggle/Inline';
const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className={styles.NavBox}>
      <ul>
        {contentRoutes
          .filter((menu) => !menu.hideInMenu)
          .map((menu) => (
            <li
              key={menu.path}
              className={location.pathname === menu.path ? styles.active : ''}
              onClick={() => {
                const targetPath = menu.path || '';
                navigate(targetPath);
              }}
            >
              {menu.title}
            </li>
          ))}
      </ul>
      <div className={styles.toggleWrap}>
        <ThemeToggleInline />
      </div>
    </div>
  );
};

export default Nav;
