

import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';
import { viteMockServe } from 'vite-plugin-mock';
import stylelint from 'vite-plugin-stylelint';

// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      stylelint({
        fix: true,
        include: ['src/**/*.{css,scss,sass}'],
        exclude: ['node_modules'],
        lintOnStart: false,
        cache: true,
      }),

      // Gzip压缩配置优化
      isProd &&
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 1024 * 10, // 优化为10KB以上文件进行压缩
          deleteOriginFile: false, // 保留原始文件，以支持不兼容gzip的浏览器
          compressionOptions: {
            level: 9, // 最高压缩级别
          },
        }),

      // Mock服务
      viteMockServe({
        mockPath: 'mock',
        enable: !isProd, // 仅在非生产环境启用mock
        watchFiles: true,
        logger: true,
      }),

      // 图片优化
      isProd &&
        viteImagemin({
          gifsicle: {
            optimizationLevel: 7,
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 7,
          },
          mozjpeg: {
            quality: 80,
          },
          pngquant: {
            quality: [0.8, 0.9],
            speed: 4,
          },
          svgo: {
            plugins: [
              {
                name: 'removeViewBox',
              },
              {
                name: 'removeEmptyAttrs',
                active: false,
              },
            ],
          },
        }),

      // 打包分析
      isProd &&
        visualizer({
          open: false, // 自动打开视图，生产环境下改为false，由CI/CD流程决定
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ].filter(Boolean),

    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096, // 4kb以下的资源内联为base64
      cssCodeSplit: true,
      sourcemap: isProd ? false : 'inline',
      minify: isProd ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            antd: ['antd', '@ant-design/icons', '@ant-design/pro-components'],
            react: ['react', 'react-dom', 'react-query', 'react-router-dom', 'react-virtualized'],
            redux: ['react-redux', 'redux', 'redux-thunk', 'redux-persist'],
          },
          chunkFileNames: isProd ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
          entryFileNames: isProd ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
          assetFileNames: isProd ? 'assets/[ext]/[name].[hash].[ext]' : 'assets/[ext]/[name].[ext]',
        },
      },
      // 启用构建缓存
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      chunkSizeWarningLimit: 1000, // 增大chunk警告尺寸，适合大型企业应用
    },

    server: {
      port: 8000,
      open: true,
      host: '0.0.0.0',
      strictPort: false,
      cors: true,
      proxy: {
        [`/${env.VITE_APP_BASE_API}`]: {
          target: `${env.VITE_APP_BASE_URL}`,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^/${env.VITE_APP_BASE_API}`), ''),
          secure: false,
          ws: true,
        },
      },
      // 允许热更新工作在代理后面
      hmr: {
        overlay: true,
      },
      // 开发服务器响应头，增加安全性
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@styles': path.resolve(__dirname, 'src/styles'),
      },
      // 优化模块解析
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      // 预构建优化
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },

    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __APP_BASE_API__: JSON.stringify(env.VITE_APP_BASE_API),
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __GIT_COMMIT__: JSON.stringify(process.env.GIT_COMMIT || ''),
      // 移除开发环境的调试代码
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#1890ff',
          },
          // 引入全局的less变量文件
          // additionalData: '@import "@/styles/variables.less";',
        },
        scss: {
          // 引入全局的scss变量
          // additionalData: '@import "@/styles/variables.scss";',
        },
      },
      modules: {
        generateScopedName: isProd
          ? '[hash:base64:8]' // 生产环境使用短哈希
          : '[name]__[local]___[hash:base64:5]', // 开发环境保留可读性
        localsConvention: 'camelCaseOnly', // 支持驼峰式访问
      },
      // 优化CSS代码分割
      devSourcemap: !isProd,
    },

    // 优化预加载
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: [],
      esbuildOptions: {
        target: 'es2015',
      },
    },

    // 性能优化
    esbuild: {
      legalComments: 'none',
      // 生产环境下移除console和debugger
      drop: isProd ? ['console', 'debugger'] : [],
    },
  };
});
