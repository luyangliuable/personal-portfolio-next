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
                "src/components/Utility/**/*.ts",
                "src/repositories/**/*.ts",
                "src/utils/BlogPage/BlogContent/MarkdownRendererV2/**/*.ts",
            ],
            exclude: [
                "src/__tests__/**",
                "**/*.test.{ts,tsx}",
                "**/*.spec.{ts,tsx}",
                "**/*.d.ts",
                "**/Interface/**",
                "**/interfaces/**",
                "**/index.{ts,tsx}",
                "**/types/**",
                "**/constants/**",
                "src/app/**",
                "src/components/Utility/DebugUtility.ts",
                "src/components/Utility/ScrollUtility.ts",
                "src/repositories/Response/**",
                "src/utils/BlogPage/BlogContent/MarkdownRendererV2/reactComponentWhiteList.ts",
                "src/utils/BlogPage/BlogContent/MarkdownRendererV2/Plugins/customCodeBlockPlugin.ts",
                "src/repositories/NoteRepository.ts",
                ...coverageConfigDefaults.exclude,
            ],
            thresholds: {
                lines: 70,
                functions: 70,
                statements: 70,
                branches: 70,
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
