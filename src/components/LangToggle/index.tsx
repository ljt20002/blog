import { Select } from '@arco-design/web-react';
import React from 'react';
import { useI18n } from '@/i18n';
import styles from './index.module.less';

const LangToggle: React.FC = () => {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={styles.langToggle} aria-label={t('lang.switchAria')}>
      <Select value={lang} onChange={(v) => setLang(v as any)} size="small" style={{ width: 120 }}>
        <Select.Option value="zh-CN">{t('lang.zh')}</Select.Option>
        <Select.Option value="en-US">{t('lang.en')}</Select.Option>
      </Select>
    </div>
  );
};

export default LangToggle;