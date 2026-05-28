import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import postcss from "postcss";
import cssnano from "cssnano";

const cssDir = join("_site", "assets", "css");
const cssnanoPlugin = cssnano({ preset: "default" });

async function collectCssFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }

  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectCssFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      files.push(path);
    }
  }

  return files;
}

const cssFiles = await collectCssFiles(cssDir);

for (const file of cssFiles) {
  const css = await readFile(file, "utf8");
  const result = await postcss([cssnanoPlugin]).process(css, { from: file, to: file });
  await writeFile(file, result.css);
}

console.log(`Minified ${cssFiles.length} CSS files in ${cssDir}`);
