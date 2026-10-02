import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const tsRecommended = tseslint.configs.recommended.map(config => ({
  ...config,
  files: ['**/*.{ts,tsx}'],
}));

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/playwright-report/**', '**/test-results/**'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {...globals.node},
    },
  },
  ...tsRecommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
