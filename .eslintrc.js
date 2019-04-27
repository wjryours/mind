module.exports = {
  parser: 'babel-eslint',
  extends: ['plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    }
  },
  env: {
    browser: true,
    node: true
  },
  plugins: [
    'import',
    'react',
    'jsx-a11y'
  ],
  settings: {

  },
  rules: {
    "react/display-name": 1,
    'no-console':'off',
    'no-debugger':'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-dupe-keys':'off',
    'no-unused-vars': 0,
    'semi': ['error', 'never'],
    'import/extensions': ['error', 'never', {'png': 'always', 'gif': 'always'}],
    'import/no-unresolved': [0, {}],
    'import/no-extraneous-dependencies': [0, {}],
    'indent': [0, 2],
    'func-names': [0, 'always'],
    'object-curly-spacing': [0, 'never'],
    'max-len': [2, { 'code': 1000 }],
    'camelcase': [0],
    'no-use-before-define': [2, {'functions': false}]
  },
}
