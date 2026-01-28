// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      // 👇 ИЗМЕНИТЕ ЭТУ СТРОКУ
      sourceType: 'module', 
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // Если правило no-unsafe-call всё равно мешает (иногда бывает с внешними либами),
      // можно понизить его уровень до warning или выключить:
      '@typescript-eslint/no-unsafe-call': 'warn', 
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);