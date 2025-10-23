import React, { useMemo, useState } from 'react';
import styles from './index.module.less';
import { useI18n } from '@/i18n';

interface TextTranslatorProps {
  text?: string;
}

const TextTranslator: React.FC<TextTranslatorProps> = ({ text }) => {
  // 如果没有传入文本，则不渲染组件，避免出现在页面底部
  if (!text || text.trim() === '') {
    return null;
  }

  const [translatedText, setTranslatedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useI18n();

  const detectUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch user location');
      }
      return await response.json();
    } catch (err) {
      console.error('获取用户地理位置失败:', err);
      setError(t('translator.geoError'));
      return null;
    }
  };

  const determineTargetLang = (countryCode: string | undefined): string => {
    return countryCode === 'CN' ? 'en' : 'zh';
  };

  const translatedPlaceholder = useMemo(() => {
    if (!text) return '';
    return text.length > 200 ? text.slice(0, 200) + '...' : text;
  }, [text]);

  const translateText = async () => {
    setLoading(true);
    setError(null);
    setTranslatedText('');

    const locationData = await detectUserLocation();
    if (!locationData) {
      setLoading(false);
      return;
    }

    const targetLang = determineTargetLang(locationData.country_code || locationData.country);

    try {
      // Primary translation service (mock)
      const res = await fetch('https://example-translate-service.com/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang }),
      });

      if (!res.ok) {
        console.warn('Primary translation service failed:', res.statusText);
        throw new Error('Primary translation service failed');
      }

      const data = await res.json();
      setTranslatedText(data.translatedText || '');
    } catch (err) {
      console.error('翻译失败:', err);
      setError(t('translator.translateFailed'));

      // Fallback due to service connection issues
      try {
        // Mock fallback
        await new Promise((r) => setTimeout(r, 300));
        setTranslatedText(`[${targetLang}] ` + translatedPlaceholder);
      } catch (fallbackErr) {
        console.error('无法连接翻译服务，请稍后再试', fallbackErr);
        setError(t('translator.serviceUnavailable'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.translatorBox}>
      <div className={styles.sourceText}>{text}</div>
      {translatedText && <div className={styles.translatedText}>{translatedText}</div>}
      {error && <div className={styles.error}>{error}</div>}
      <button onClick={translateText} disabled={loading} aria-busy={loading}>
        {loading ? t('translator.translating') : t('translator.translate')}
      </button>
    </div>
  );
};

export default TextTranslator;
