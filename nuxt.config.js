import { fileURLToPath } from 'url'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
   alias: {
    // 确保路径别名正确解析
    '~': fileURLToPath(new URL('./', import.meta.url)),
    '@': fileURLToPath(new URL('./', import.meta.url))
  },
  // devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image',
    'dayjs-nuxt'
  ],
  css: ['~/assets/css/main.css'],
 vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      sourcemap: false,
    },
    resolve: {
      alias: {
        process: "process/browser"
      }
    }
  },
  ui: {
    fonts: false
  },
  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: './assets/icons'
    }]
  },
   dayjs: {
    locales: ['zh-cn'],
    plugins: ['relativeTime'],
    defaultLocale: 'zh-cn',
  },
});