import typescriptConfig from '@nuxtjs/eslint-config-typescript'
import prettierConfig from 'eslint-config-prettier'

export default [
  typescriptConfig,
  prettierConfig,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-expressions': 'off',
    },
    ignores: ['node_modules', 'dist', '.nuxt', '.output', 'coverage', 'components.d.ts', 'nuxt.d.ts'],
  },
]
