import { glob, rename } from "node:fs/promises";
import { join, relative } from "node:path";

const baseDir = process.argv[2] ?? "";
const dir = join(process.cwd(), baseDir, "kubejs");

await Array.fromAsync(
	glob([
		join(dir, "**", "*.client.js"),
		join(dir, "**", "*.server.js"),
		join(dir, "**", "*.startup.js")
	])
).then((files) =>
	Promise.all(
		files.map(async (file) => {
			const src = relative(dir, file);
			const splitName = src.split(".");
			splitName.splice(1, 1);
			const dist = splitName.join(".");
			await rename(join(dir, src), join(dir, dist));
		})
	)
);
