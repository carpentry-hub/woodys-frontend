import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        rules: {
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'eqeqeq': ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'error',  
            //'no-console': 'warn',
            'indent': ['error', 4],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'warn',
            'react/jsx-pascal-case': 'error'
        },
    },
]);
