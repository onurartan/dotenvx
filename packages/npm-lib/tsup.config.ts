import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "cli/index.ts"], 
  splitting: false, 
  minify: true, 
  target: 'es2020',
  // target: "esnext",
  external: [], 
  sourcemap: true, 
 dts: {
    resolve: true,
   compilerOptions: {
      module: "esnext" // import.meta izin veren modül tipi
    }
  },
  clean: true,
  skipNodeModulesBundle: true,
  format: ["esm", "cjs"], 
  shims: true, 
  treeshake: true, 

  
});
