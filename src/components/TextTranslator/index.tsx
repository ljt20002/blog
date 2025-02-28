import React, { useState, useEffect } from 'react';
import { Tooltip, Spin } from '@arco-design/web-react';
import styles from './index.module.less';

interface TranslationResult {
  text: string;
  from: string;
  to: string;
}

interface GeoLocation {
  country_code: string;
  country_name: string;
}

const TextTranslator: React.FC = () => {
  const [selectedText, setSelectedText] = useState('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');

  // 获取用户地理位置并设置目标语言
  useEffect(() => {
    const detectUserLanguage = async () => {
      try {
        // 使用免费的IP地理位置API
        const response = await fetch('https://ipapi.co/json/');
        const data: GeoLocation = await response.json();

        // 根据国家/地区代码设置目标语言
        switch (data.country_code) {
          case 'JP':
            setTargetLanguage('ja');
            break;
          case 'CN':
          case 'TW':
          case 'HK':
            setTargetLanguage('zh-CN');
            break;
          case 'KR':
            setTargetLanguage('ko');
            break;
          case 'FR':
            setTargetLanguage('fr');
            break;
          case 'DE':
            setTargetLanguage('de');
            break;
          case 'ES':
            setTargetLanguage('es');
            break;
          default:
            setTargetLanguage('en'); // 默认使用英语
        }
      } catch (error) {
        console.error('获取用户地理位置失败:', error);
        setTargetLanguage('en'); // 出错时默认使用英语
      }
    };

    detectUserLanguage();
  }, []);

  // 监听文本选择事件
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const text = selection.toString().trim();
        setSelectedText(text);

        // 获取选中文本的位置
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.bottom + window.scrollY,
        });

        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  // 翻译文本
  const translateText = async () => {
    if (!selectedText) {
      return;
    }

    setLoading(true);
    try {
      // First try with bing-tr-free API
      try {
        const response = await fetch('https://bing-tr-free.vercel.app/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: selectedText,
            from: 'auto-detect',
            to: targetLanguage, // 使用根据IP确定的目标语言
          }),
          signal: AbortSignal.timeout(5000),
        });

        const data = await response.json();
        if (data.translation) {
          setTranslation({
            text: data.translation,
            from: data.detectedLanguage || 'auto',
            to: targetLanguage,
          });
          return;
        }
      } catch (firstError) {
        console.error('Primary translation service failed:', firstError);
      }

      // Fallback to MyMemory API
      const fallbackResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(selectedText)}&langpair=zh-CN|${targetLanguage}`,
        {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        },
      );

      const fallbackData = await fallbackResponse.json();
      if (fallbackData.responseData) {
        setTranslation({
          text: fallbackData.responseData.translatedText,
          from: 'zh-CN',
          to: targetLanguage,
        });
      } else {
        throw new Error('Fallback translation also failed');
      }
    } catch (error) {
      console.error('翻译失败:', error);
      setTranslation({
        text: '无法连接翻译服务，请稍后再试',
        from: 'auto',
        to: targetLanguage,
      });
    } finally {
      setLoading(false);
    }
  };

  // 当选中文本时显示翻译按钮
  if (!visible) {
    return null;
  }

  return (
    <div
      className={styles.translatorButton}
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
      }}
    >
      <Tooltip
        content={
          loading ? (
            <Spin />
          ) : translation ? (
            <div className={styles.translationResult}>{translation.text}</div>
          ) : (
            '点击翻译'
          )
        }
        position="bottom"
        trigger="click"
      >
        <button onClick={translateText}>译</button>
      </Tooltip>
    </div>
  );
};

export default TextTranslator;
