import { coverageConfigDefaults, defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/__tests__/**/*.{test,spec}.{ts,tsx}"],
        exclude: [
            "node_modules/**",
            ".next/**",
            "python-env/**",
            "openapi-gen/**",
            ".agent-shell/**",
        ],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "json-summary", "html", "lcov"],
            reportsDirectory: "./coverage/unit",
            include: [
                "src/components/Utility/LogicUtility.ts",
                "src/components/Utility/StringUtility.ts",
                "src/page/BlogPage/BlogContent/MarkdownRendererV2/remarkTableToHtml.ts",
                "src/utils/BlogPage/BlogContent/MarkdownRendererV2/utils.ts",
            ],
            exclude: [
                "src/__tests__/**",
                "**/*.test.{ts,tsx}",
                "**/*.spec.{ts,tsx}",
                "**/*.d.ts",
                "**/Interface/**",
                "**/interfaces/**",
                "**/index.{ts,tsx}",
                ...coverageConfigDefaults.exclude,
            ],
            thresholds: {
                lines: 71,
                functions: 71,
                statements: 71,
                branches: 60,
                perFile: true,
            },
        },
        reporters: ["verbose", "json", "junit"],
        outputFile: {
            json: "./test-results/unit-results.json",
            junit: "./test-results/unit-junit.xml",
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
