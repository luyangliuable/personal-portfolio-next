import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { seedId } from "./render.mjs";

const SKIPPED_DIRS = new Set(["node_modules"]);

async function* markdownFiles(root, dir = root) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".") || SKIPPED_DIRS.has(entry.name))
            continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* markdownFiles(root, fullPath);
        else if (entry.name.toLowerCase().endsWith(".md") && dir !== root)
            yield path.relative(root, fullPath);
    }
}

function headingFor(filePath, body) {
    const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (heading) return heading;
    const { dir, name } = path.parse(filePath);
    return name.toLowerCase() === "readme" ? path.basename(dir) : name;
}

/** One Note document per markdown file, tagged by its top-level folder. */
export async function collectNotes(root) {
    const notes = [];
    for await (const filePath of markdownFiles(root)) {
        const fullPath = path.join(root, filePath);
        const [body, info] = await Promise.all([
            readFile(fullPath, "utf8"),
            stat(fullPath),
        ]);
        // Empty notes would only render blank pages.
        if (!body.trim()) continue;
        const category = filePath.split(path.sep)[0];
        notes.push({
            id: seedId(`note:${filePath}`),
            category,
            heading: headingFor(filePath, body),
            filePath,
            date: info.mtime,
            minutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
        });
    }
    return notes;
}
