import { useEffect, useState } from 'react';
import { Switch } from '@arco-design/web-react';
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
import { useI18n } from '@/i18n';

const ThemeToggleInline = () => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const { t } = useI18n();

  useEffect(() => {
    const saved = getTheme();
    setThemeState(saved);
    const unsubscribe = onThemeChange((mode) => setThemeState(mode));
    return unsubscribe;
  }, []);

  const onChange = (checked: boolean) => {
    const next: ThemeMode = checked ? 'dark' : 'light';
    setThemeState(next);
    setGlobalTheme(next);
  };

  return (
    <div className={styles.inlineToggle}>
      <Switch checked={theme === 'dark'} onChange={onChange} />
      <span>{theme === 'dark' ? t('theme.dark') : t('theme.light')}</span>
    </div>
  );
};

export default ThemeToggleInline;