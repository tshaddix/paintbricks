import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Paintbricks",
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js", ".json"],
  },
  esbuild: {
    loader: "ts",
    include: /\.tsx?$/,
    exclude: /node_modules/,
  },
});
