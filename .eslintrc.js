module.exports = {
  extends: ['eslint:recommended'],
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'never'],
    indent: ['error', 2],
    curly: 'error',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    quotes: ['error', 'single'],
    'no-unused-vars': ['error', { args: 'none' }],
    'no-param-reassign': 'warn',
    'import/no-anonymous-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-relative-packages': 'off',
  },
}
