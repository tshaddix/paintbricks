import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/example.ts"),
      name: "Example",
      fileName: (format) => `example.${format}.js`,
    },
    outDir: path.resolve(__dirname, "./build"),
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
