import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { globSync } from "glob";
import picomatch from "picomatch";

const root = process.cwd();
const scope = JSON.parse(
    readFileSync(resolve(root, "coverage-scope.json"), "utf8"),
);
const coveragePath = resolve(root, "coverage/unit/coverage-final.json");

if (!existsSync(coveragePath)) {
    console.error(
        "Missing coverage/unit/coverage-final.json. Run npm run test:coverage first.",
    );
    process.exit(1);
}

const structuralMatchers = scope.structuralExcludes.map((pattern) =>
    picomatch(pattern),
);
const documented = new Map(
    scope.documentedExcludes.map((entry) => [entry.path, entry.reason]),
);
const sourceFiles = scope.source.flatMap((pattern) =>
    globSync(pattern, { nodir: true, cwd: root }),
);
const meaningfulFiles = [...new Set(sourceFiles)]
    .sort()
    .filter((file) => !structuralMatchers.some((matches) => matches(file)))
    .filter((file) => !documented.has(file));

const coverage = JSON.parse(readFileSync(coveragePath, "utf8"));
const coveredFiles = new Set(
    Object.keys(coverage).map((file) =>
        relative(root, file).replaceAll("\\", "/"),
    ),
);
const missing = meaningfulFiles.filter((file) => !coveredFiles.has(file));

if (missing.length > 0) {
    console.error("Meaningful source files missing from coverage enforcement:");
    for (const file of missing) console.error(`- ${file}`);
    console.error(
        "Add meaningful tests or document a legitimate exclusion in coverage-scope.json.",
    );
    process.exit(1);
}

const invalidExcludes = [...documented.entries()].filter(
    ([, reason]) => !reason || reason.trim().length < 10,
);
if (invalidExcludes.length > 0) {
    console.error(
        "Documented coverage exclusions require a meaningful reason:",
    );
    for (const [file] of invalidExcludes) console.error(`- ${file}`);
    process.exit(1);
}

console.log(
    `Coverage scope verified for ${meaningfulFiles.length} meaningful source files.`,
);
