import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',        // main entry (export server)
    client: 'src/client.ts',      // UI-only exports
   // server: 'src/server.ts',      // middleware-safe exports
  },    // export หลักของ lib
  format: ['esm', 'cjs'],       // รองรับทั้ง import / require
  target: 'esnext',
  outDir: 'dist',
  dts: true,                    // generate .d.ts
  clean: true,                  // ลบ dist ทุกครั้ง
  minify: false,                //  ไม่ต้อง minify (เพราะเป็น lib)
  sourcemap: false,
  splitting: false,
  skipNodeModulesBundle: true, // ไม่ bundle next/react
  shims: false,
  external: ['react', 'react-dom'],
})
