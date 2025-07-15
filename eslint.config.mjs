import { defineConfig } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: compat.extends(
      'eslint:recommended',
      'eslint-config-prettier',
    ),

    plugins: {
      prettier,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },

    rules: {
      semi: ['error', 'always'],
      indent: ['error', 2, {
        SwitchCase: 1,
      }],
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'off',
      'no-use-before-define': 'warn',

      'import/order': ['error', {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always-and-inside-groups',
      }],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.test.ts', '**/*.spec.ts'],
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'eslint-config-prettier',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',

      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      semi: ['error', 'always'],

      indent: ['error', 2, {
        SwitchCase: 1,
      }],

      quotes: ['error', 'single'],
      'no-unused-vars': 'off', // Turn off base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-const-enum': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-use-before-define': 'warn',

      'import/order': ['error', {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always-and-inside-groups',
      }],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'eslint-config-prettier',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',

      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      semi: ['error', 'always'],

      indent: ['error', 2, {
        SwitchCase: 1,
      }],

      quotes: ['error', 'single'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-const-enum': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-use-before-define': 'warn',

      'import/order': ['error', {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always-and-inside-groups',
      }],
    },
  },
]);
