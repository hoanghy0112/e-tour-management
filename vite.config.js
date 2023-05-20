import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "./",
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: "globalThis",
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: true,
					buffer: true,
				}),
			],
		},
	},
	resolve: {
		alias: {
			process: "process/browser",
			stream: "stream-browserify",
			zlib: "browserify-zlib",
			util: "util",
		},
	},
});
