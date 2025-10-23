import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { useI18n } from '@/i18n';

const ErrorFallback: React.FC = () => {
  const error = useRouteError();
  const { t } = useI18n();

  const message = (() => {
    if (isRouteErrorResponse(error)) {
      return `${error.status} ${error.statusText}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return t('error.unknown');
    }
  })();

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>{t('error.pageError.title')}</h2>
      <p style={{ color: '#4e5969', marginBottom: 16 }}>{message}</p>
      <Link to="/home">{t('error.backHome')}</Link>
    </div>
  );
};

export default ErrorFallback;