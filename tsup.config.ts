import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/*.ts', 'src/drivers/*.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
})
