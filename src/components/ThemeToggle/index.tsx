import { useEffect, useState } from 'react';
import { Button, Tooltip } from '@arco-design/web-react';
import { IconSun, IconMoon } from '@arco-design/web-react/icon';
import styles from './index.module.less';

const THEME_KEY = 'theme';

type ThemeMode = 'light' | 'dark';

const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  if (mode === 'dark') {
    document.body.setAttribute('arco-theme', 'dark');
  } else {
    document.body.removeAttribute('arco-theme');
  }
};

import { getTheme, setTheme as setGlobalTheme, onThemeChange } from '@/utils/theme';

const ThemeToggle = () => {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    const saved = getTheme();
    setThemeState(saved);
    const unsubscribe = onThemeChange((mode) => setThemeState(mode));
    return unsubscribe;
  }, []);

  const toggle = () => {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    setGlobalTheme(next);
  };

  return (
    <div className={styles.themeToggle}>
      <Tooltip content={theme === 'light' ? '切换到夜间模式' : '切换到日间模式'} position="left">
        <Button shape="circle" type="secondary" aria-label="切换主题" onClick={toggle}>
          {theme === 'light' ? <IconMoon /> : <IconSun />}
        </Button>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;