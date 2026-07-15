import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'out/**/*',
      'dist/**/*',
      '.astro/**/*',
      'eslint.config.mjs',
      'getGeneLocations.ts',
      'updateCategories.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
)
