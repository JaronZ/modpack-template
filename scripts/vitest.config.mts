import type { ESBuildOptions } from "vite";
import { defineConfig, type ViteUserConfig } from "vitest/config";

export const createVitestConfig = (options: ViteUserConfig = {}) =>
	defineConfig({
		...options,
		test: {
			...options?.test,
			globals: true,
			coverage: {
				...options.test?.coverage,
				provider: "v8",
				enabled: true,
				reporter: ["text", "lcov"],
				exclude: [
					...(options.test?.coverage?.exclude ?? []),
					"**/node_modules/**",
					"**/kubejs/**",
					"**/test/**",
					"**/.probe/**",
					"**/scripts/**",
					"**/typings/**",
					"**/.yarn/**",
					"**/tsup.config.ts",
					"**/vitest.config.ts",
					"eslint.config.mjs",
					"prettier.config.mjs",
					"vitest.workspace.ts",
					"commitlint.config.mjs"
				]
			}
		},
		esbuild: {
			...options?.esbuild,
			target:
				(options?.esbuild as ESBuildOptions | undefined)?.target ??
				"es2021"
		}
	});
