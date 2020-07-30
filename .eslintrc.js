module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript'],
  parserOptions: {
    // Only ESLint 6.2.0 and later support ES2020.
    ecmaVersion: 2020,
    // sourceType: 'module'
  },
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    browser: true,
    node: true,
    mocha: true,
    jest: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    // 自定义你的规则
    'no-param-reassign': 1,
    'no-new-func': 1,
    'spaced-comment': 1,
    'no-eq-null': 1,
    'eqeqeq': 1,
    'no-eval': 1,
    'no-case-declarations': 1,
    'no-new-object': 1,
    '@typescript-eslint/triple-slash-reference': 1,
    '@typescript-eslint/no-invalid-void-type': 1,
    '@typescript-eslint/no-require-imports': 1,
  }
};
