import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    alias: {
      '#service': 'src/service',
      '#routes': 'src/routes',
      '#config': 'src/config',
      '#common': 'src/common',
      '#core': 'src/core'
    }
  }
})
