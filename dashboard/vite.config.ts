import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            entryRoot: "src",
            outDir: "dist",
            exclude: ["**/*.test.ts"],
        }),
    ],
    build: {
        target: "esnext",
        outDir: "dist",
        lib: {
            entry: {
                index: "./src/index.ts",
                bin: "./src/bin.ts",
            },
            formats: ["es"],
            fileName: (_, entryName) => `${entryName}.js`,
        },
        rollupOptions: {
            external: [
                /^@riotprompt\//,
                /^node:/,
            ],
            output: {
                format: "esm",
                preserveModules: false,
                exports: "named",
            },
        },
        minify: false,
        sourcemap: true,
    },
});

