import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  ...compat.extends('plugin:prettier/recommended'),
  {
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'no-empty-pattern': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
