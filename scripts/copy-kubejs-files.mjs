import { glob, mkdir, copyFile } from "node:fs/promises";
import { join, dirname, relative } from "node:path";

const srcDir = join(process.cwd(), "src");
const outDir = join(process.argv[2] ?? "", "kubejs");

await Array.fromAsync(
	glob([
		join(srcDir, "config", "**", "*.*"),
		join(srcDir, "data", "**", "*.*"),
		join(srcDir, "assets", "**", "*.*")
	])
).then((files) =>
	Promise.all(
		files.map(async (file) => {
			const dest = join(outDir, relative(srcDir, file));
			await mkdir(dirname(dest), { recursive: true });
			await copyFile(file, dest);
		})
	)
);
