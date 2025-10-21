import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

const ErrorFallback: React.FC = () => {
  const error = useRouteError();

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
      return '未知错误';
    }
  })();

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>页面发生错误</h2>
      <p style={{ color: '#4e5969', marginBottom: 16 }}>{message}</p>
      <Link to="/home">返回首页</Link>
    </div>
  );
};

export default ErrorFallback;