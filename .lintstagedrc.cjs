module.exports = {
  // TypeScript 和 JavaScript 文件
  '*.{js,jsx,ts,tsx}': [
    'npx eslint --fix',
    'npx prettier --write',
  ],
  
  // 样式文件
  '*.{css,scss,less}': [
    'npx stylelint --fix',
    'npx prettier --write',
  ],
  
  // JSON 文件
  '*.{json,jsonc}': [
    'npx prettier --write',
  ],
  
  // Markdown 文件
  '*.md': [
    'npx prettier --write',
  ],
  
  // YAML 文件
  '*.{yml,yaml}': [
    'npx prettier --write',
  ],
  
  // 其他配置文件
  '*.{html,xml}': [
    'npx prettier --write',
  ],
};
