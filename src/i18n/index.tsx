import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

export type Lang = 'zh-CN' | 'en-US';

const LANG_KEY = 'lang';

type Messages = Record<string, string>;
const DICTS: Record<Lang, Messages> = {
  'zh-CN': zhCN as Messages,
  'en-US': enUS as Messages,
};

export interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const detectDefaultLang = (): Lang => {
  const saved = localStorage.getItem(LANG_KEY) as Lang | null;
  if (saved === 'zh-CN' || saved === 'en-US') return saved;
  const nav = navigator.language?.toLowerCase() || 'zh-cn';
  return nav.startsWith('zh') ? 'zh-CN' : 'en-US';
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(detectDefaultLang());

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = useMemo(() => {
    const dict = DICTS[lang];
    const fallback = DICTS['zh-CN'];
    return (key: string, params?: Record<string, string | number>) => {
      const template = dict[key] ?? fallback[key] ?? key;
      if (!params) return template;
      return template.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
    };
  }, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};

// 提供一个无需 React 上下文的原始翻译函数，供工具模块使用
export const tRaw = (key: string, params?: Record<string, string | number>) => {
  const saved = (localStorage.getItem(LANG_KEY) as Lang | null) || detectDefaultLang();
  const dict = DICTS[saved];
  const fallback = DICTS['zh-CN'];
  const template = dict[key] ?? fallback[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
};