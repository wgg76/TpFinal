import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // 1) Ignore built files
  {
    ignores: ['dist'],
  },
  // 2) Apply to JS/JSX source
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser, // browser globals
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // include ESLint's recommended base rules
      ...js.configs.recommended.rules,
      // include React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // turn off the fast-refresh-only rule
      'react-refresh/only-export-components': 'off',
      // warn on missing dependencies
      'react-hooks/exhaustive-deps': 'warn',
      // enforce no-unused-vars but allow uppercase (e.g. React components)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]
