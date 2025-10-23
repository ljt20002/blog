export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'theme';
const THEME_EVENT = 'theme-change';

export const getTheme = (): ThemeMode => {
  const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null;
  return saved === 'dark' || saved === 'light' ? saved : 'light';
};

export const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  if (mode === 'dark') {
    document.body.setAttribute('arco-theme', 'dark');
  } else {
    document.body.removeAttribute('arco-theme');
  }
};

export const setTheme = (mode: ThemeMode) => {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
  // 广播给所有订阅者（同一页内的多个组件）
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { mode } }));
};

export const initTheme = () => {
  const mode = getTheme();
  applyTheme(mode);
};

export const onThemeChange = (listener: (mode: ThemeMode) => void) => {
  const handler = (e: Event) => {
    const ce = e as CustomEvent;
    const mode = ce.detail?.mode as ThemeMode;
    if (mode === 'dark' || mode === 'light') listener(mode);
  };
  window.addEventListener(THEME_EVENT, handler as EventListener);
  return () => window.removeEventListener(THEME_EVENT, handler as EventListener);
};