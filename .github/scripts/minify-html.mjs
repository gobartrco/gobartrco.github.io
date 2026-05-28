import { minify } from "html-minifier-terser";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import postcss from "postcss";
import cssnano from "cssnano";

const siteDir = "_site";

const cssnanoPlugin = cssnano({ preset: "default" });

/** html-minifier-terser uses clean-css when minifyCSS is true; it cannot parse Tailwind v4. */
async function minifyInlineCss(text) {
  try {
    const result = await postcss([cssnanoPlugin]).process(text, { from: undefined });
    return result.css;
  } catch {
    return text;
  }
}

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(path);
    }
  }

  return files;
}

const minifyOptions = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: minifyInlineCss,
  minifyJS: true,
};

const htmlFiles = await collectHtmlFiles(siteDir);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const minified = await minify(html, minifyOptions);
  await writeFile(file, minified);
}

console.log(`Minified ${htmlFiles.length} HTML files in ${siteDir}`);
