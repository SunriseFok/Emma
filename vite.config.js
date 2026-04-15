import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['xcmg-logo.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: '徐工矿机事件管理平台原型',
        short_name: 'XCMG事件平台',
        description: '徐工矿机设备运维工程师事件管理平台 PWA 原型',
        theme_color: '#0057B8',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
