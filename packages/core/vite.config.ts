import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      outDir: 'dist',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    }),
    // 複製 public 資源到 dist
    {
      name: 'copy-public-assets',
      closeBundle() {
        const publicDir = resolve(__dirname, 'public')
        const distDir = resolve(__dirname, 'dist')
        const geoSrc = join(publicDir, 'geo')
        const geoDest = join(distDir, 'geo')

        if (existsSync(geoSrc)) {
          if (!existsSync(geoDest)) {
            mkdirSync(geoDest, { recursive: true })
          }

          const files = readdirSync(geoSrc)
          files.forEach((file: string) => {
            copyFileSync(join(geoSrc, file), join(geoDest, file))
          })

          console.log('✓ Copied GeoJSON files to dist/geo/')
        }
      },
    },
  ],
  publicDir: 'public',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueEChartsWorkbench',
      formats: ['es', 'umd'],
      fileName: format => `vue-echarts-workbench.${format}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        'echarts',
        'vue-echarts',
        '@vuepic/vue-datepicker',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
      ],
      output: {
        globals: {
          vue: 'Vue',
          echarts: 'echarts',
          'vue-echarts': 'VueECharts',
          '@vuepic/vue-datepicker': 'VueDatePicker',
          '@fortawesome/fontawesome-svg-core': 'FontAwesome',
          '@fortawesome/free-solid-svg-icons': 'FontAwesomeSolidIcons',
          '@fortawesome/vue-fontawesome': 'VueFontAwesome',
        },
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || ''
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'terser',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
