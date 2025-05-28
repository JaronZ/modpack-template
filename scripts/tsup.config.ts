import { relative, resolve as resolveDir } from "node:path";
import { defineConfig, type Options } from "tsup";

const baseOptions: Options = {
	clean: true,
	dts: false,
	minify: true,
	skipNodeModulesBundle: true,
	sourcemap: false,
	target: "es5",
	keepNames: true,
	treeshake: true,
	format: "cjs",
	tsconfig: relative(
		__dirname,
		resolveDir(process.cwd(), "src", "tsconfig.json")
	)
};

function createTsupConfig(outDir: string, options: EnchancedTsupOptions) {
	const { packName = "" } = options;
	return [
		defineConfig({
			...baseOptions,
			entry: ["src/**/*.client.ts"],
			outDir: `${outDir}/kubejs/client_scripts/${packName}`,
			...options.clientOptions
		}),
		defineConfig({
			...baseOptions,
			entry: ["src/**/*.server.ts"],
			outDir: `${outDir}/kubejs/server_scripts/${packName}`,
			...options.serverOptions
		}),
		defineConfig({
			...baseOptions,
			entry: ["src/**/*.startup.ts"],
			outDir: `${outDir}/kubejs/startup_scripts/${packName}`,
			...options.startupOptions
		})
	];
}

export function createKubeJSPackTsupConfig(options: EnchancedTsupOptions = {}) {
	return createTsupConfig(".", options);
}

export function createModpackTsupConfig(options: EnchancedTsupOptions = {}) {
	return createTsupConfig("modpack", options);
}

interface EnchancedTsupOptions {
	packName?: string;
	clientOptions?: Options;
	serverOptions?: Options;
	startupOptions?: Options;
}
