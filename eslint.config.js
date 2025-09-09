
import js from '@eslint/js'; // 导入ESLint核心JavaScript规则
import { globalIgnores } from 'eslint/config'; // 导入ESLint全局忽略配置
import prettier from 'eslint-config-prettier'; // 导入Prettier配置以避免冲突
import importPlugin from 'eslint-plugin-import'; // 导入ESLint导入/导出规则插件
import jsxA11y from 'eslint-plugin-jsx-a11y'; // 导入JSX可访问性规则插件
import react from 'eslint-plugin-react'; // 导入React规则插件
import reactHooks from 'eslint-plugin-react-hooks'; // 导入React Hooks规则插件
import reactRefresh from 'eslint-plugin-react-refresh'; // 导入React Refresh规则插件
import globals from 'globals'; // 导入全局变量定义
import tseslint from 'typescript-eslint'; // 导入TypeScript ESLint插件

export default tseslint.config([
  // 导出TypeScript ESLint配置数组
  globalIgnores(['dist', 'node_modules', '*.min.js', 'coverage']), // 全局忽略这些文件夹和文件类型
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // 应用于所有JS/TS文件
    extends: [
      // 扩展这些基础配置
      js.configs.recommended, // ESLint推荐的JavaScript规则
      tseslint.configs.recommended, // TypeScript ESLint推荐规则
      reactHooks.configs['recommended-latest'], // React Hooks最新推荐规则
      reactRefresh.configs.vite, // Vite的React Refresh规则
      prettier, // Prettier配置，必须放在最后以覆盖冲突规则
    ],
    languageOptions: {
      // 语言选项配置
      ecmaVersion: 2020, // 使用ECMAScript 2020特性
      globals: {
        // 全局变量定义
        ...globals.browser, // 包括浏览器环境的全局变量
        ...globals.node, // 包括Node环境的全局变量
      },
      parser: tseslint.parser, // 使用TypeScript解析器
      parserOptions: {
        // 解析器选项
        ecmaFeatures: {
          // ECMAScript特性
          jsx: true, // 启用JSX支持
        },
      },
    },
    plugins: {
      // 使用的插件
      react, // React插件
      'jsx-a11y': jsxA11y, // JSX可访问性插件
      import: importPlugin, // 导入/导出插件
    },
    settings: {
      // 设置项
      'import/resolver': {
        // 导入解析器设置
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      react: {
        // React设置
        version: 'detect', // 自动检测React版本
      },
    },
    rules: {
      // 规则配置
      // React 规则
      'react/jsx-uses-react': 'error', // 强制检查JSX中是否引入了React
      'react/jsx-uses-vars': 'error', // 防止在JSX中使用的变量被标记为未使用
      'react/jsx-no-undef': 'error', // 禁止在JSX中使用未声明的变量
      'react/jsx-no-duplicate-props': 'error', // 防止在JSX中重复属性
      'react/jsx-pascal-case': 'error', // 强制JSX组件名使用PascalCase
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'], // 强制JSX标签闭合括号位置
      'react/jsx-key': 'error', // 检测数组或迭代器中的子组件是否有key属性
      'react/self-closing-comp': 'error', // 防止没有子节点的组件使用封闭标签
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }], // 控制JSX属性和子元素中花括号的使用

      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'warn', // 警告使用any类型
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭导出函数和类的显式返回类型
      '@typescript-eslint/no-unused-vars': [
        // 未使用变量配置
        'error',
        {
          argsIgnorePattern: '^_', // 以_开头的参数不检查
          varsIgnorePattern: '^_', // 以_开头的变量不检查
        },
      ],
      '@typescript-eslint/naming-convention': [
        // 命名规范
        'error',
        {
          selector: 'interface', // 接口命名规范
          format: ['PascalCase'], // 使用大驼峰命名
          prefix: ['I'], // 使用I前缀
        },
        {
          selector: 'typeAlias', // 类型别名命名规范
          format: ['PascalCase'], // 使用大驼峰命名
          prefix: ['T'], // 使用T前缀
          filter: {
            regex: '^(RootState|AppDispatch)$', // 排除Redux标准类型
            match: false,
          },
        },
        {
          selector: 'enum', // 枚举命名规范
          format: ['PascalCase'], // 使用大驼峰命名
          prefix: ['E'], // 使用E前缀
        },
        {
          selector: 'class', // 类命名规范
          format: ['PascalCase'], // 使用大驼峰命名
        },
      ],

      // 导入顺序规则
      'import/order': [
        // 导入顺序配置
        'error',
        {
          groups: [
            // 导入分组顺序
            'builtin', // 内置模块
            'external', // 外部模块
            'internal', // 内部模块
            ['parent', 'sibling', 'index'], // 父级、同级和索引文件
            'type', // 类型导入
          ],
          pathGroups: [
            // React 导入 - 第一优先级
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-*',
              group: 'external',
              position: 'before',
            },
            // 插件库导入 - 第二优先级
            {
              pattern: '{antd,antd/**,@ant-design/**}',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '{ahooks,@uidotdev/**,lodash,dayjs,axios,js-cookie,redux*,@reduxjs/**}',
              group: 'external',
              position: 'after',
            },
            // 项目内部导入 - 第三优先级
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always', // 分组之间总是添加空行
          alphabetize: {
            // 字母顺序排序
            order: 'asc', // 升序排序
            caseInsensitive: true, // 忽略大小写
          },
        },
      ],
      'import/no-duplicates': 'error', // 禁止重复导入

      // 通用规则
      'no-console': ['warn', { allow: ['warn', 'error'] }], // 警告使用console，允许warn和error
      'no-debugger': 'error', // 禁止使用debugger
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }], // 限制文件最大行数
      'max-depth': ['error', 4], // 限制嵌套块的最大深度
      'max-nested-callbacks': ['error', 3], // 限制回调嵌套的最大深度
      'max-params': ['error', 5], // 限制函数参数的最大数量
      'prefer-const': 'error', // 优先使用const
      'no-var': 'error', // 禁止使用var
      'eqeqeq': ['error', 'always'], // 强制使用===和!==
      'curly': ['error', 'all'], // 强制所有控制语句使用大括号
      'no-eval': 'error', // 禁止使用eval
      'no-implied-eval': 'error', // 禁止使用隐式eval
      'no-new-func': 'error', // 禁止使用Function构造函数
      'no-return-assign': 'error', // 禁止在return语句中使用赋值语句
      
      // 代码风格规则 (融合新配置的优点)
      'max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
        },
      ],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'no-param-reassign': 'error',
      
      // React 规则补充
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入 React
      'react/prop-types': 'off', // TypeScript 项目不需要 prop-types
    },
  },
  // 针对特定文件类型的规则
  {
    files: ['**/*.d.ts'], // 针对类型声明文件
    rules: {
      '@typescript-eslint/naming-convention': 'off', // 关闭命名规范检查
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'], // 针对测试文件
    rules: {
      'max-lines': 'off', // 关闭文件行数限制
      'max-nested-callbacks': 'off', // 关闭嵌套回调限制
    },
  },
]);
