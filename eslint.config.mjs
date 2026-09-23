import { createRequire } from 'node:module';
import { defineConfig, globalIgnores } from 'eslint/config';
import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const require = createRequire(import.meta.url);
const emotion = require('@emotion/eslint-plugin');
const nextPlugin = require('@next/eslint-plugin-next');
const react = require('eslint-plugin-react');

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.flat.recommended,
  nextPlugin.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
      '@emotion': fixupPluginRules(emotion),
    },
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.json', './bin/tsconfig.json'],
      },
    },
    rules: {
      '@emotion/pkg-renaming': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-debugger': 'warn',
      'no-undef': 'off',
      indent: 'off',
    },
  },
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'data/**',
    'coverage/**',
    'docker/**',
  ]),
]);
