import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import parser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      react: eslintPluginReact,
      '@typescript-eslint': eslintPluginTypeScript,
      'react-hooks': eslintPluginReactHooks,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginTypeScript.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      ...eslintPluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]; 