import { defineConfig } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginReact } from '@rsbuild/plugin-react';
import { join } from 'path';
export default defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  source: {
    transformImport: [
      {
        libraryName: '@arco-design/web-react',
        libraryDirectory: 'es',
        style: true,
        camelToDashComponentName: false,
      },
      {
        libraryName: '@arco-design/web-react/icon',
        libraryDirectory: 'react-icon',
        camelToDashComponentName: false,
      },
    ],
  },
  // 设置站点标题与 favicon
  html: {
    title: '嘉图的网络日志',
    favicon: './public/favicon.svg',
  },
  plugins: [pluginLess(), pluginReact()],
});
