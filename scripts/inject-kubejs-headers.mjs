import { glob, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const srcDir = join(process.cwd(), "src");
const outDir = join(process.argv[2] ?? "", "kubejs");
const packName = process.argv[3] ?? "";

async function getHeaderLines(file) {
	const content = await readFile(file, { encoding: "utf-8" });
	const headerLines = [];
	for (const line of content.split("\n")) {
		if (line.trim() === "") {
			continue;
		}
		if (!/^\/\/\w+:\s?.+/.test(line)) {
			break;
		}
		headerLines.push(line);
	}
	return headerLines.join("\n");
}

async function injectHeaders(dist, headers) {
	const content = await readFile(dist, { encoding: "utf-8" });
	await writeFile(dist, `${headers}\n${content}`);
}

await Array.fromAsync(
	glob([
		join(srcDir, "**", "*.client.ts"),
		join(srcDir, "**", "*.server.ts"),
		join(srcDir, "**", "*.startup.ts")
	])
).then((files) =>
	Promise.all(
		files.map(async (file) => {
			const src = relative(srcDir, file);
			const splitName = src.split(".");
			const scriptPath = `${splitName.splice(1, 1)[0]}_scripts`;
			const dist = join(
				outDir,
				scriptPath,
				packName,
				`${splitName[0]}.js`
			);

			const headers = await getHeaderLines(file);

			if (headers === "") return;

			await injectHeaders(dist, headers);
		})
	)
);
