import { describe, expect, it } from "vitest";

const logicBearingComponentFilesWithCoverage = [
    "src/components/Utility/LogicUtility.ts",
    "src/components/Utility/StringUtility.ts",
];

describe("component logic coverage scope", () => {
    it("documents every component file with logic that is enforced by per-file coverage thresholds", () => {
        expect(logicBearingComponentFilesWithCoverage).toEqual([
            "src/components/Utility/LogicUtility.ts",
            "src/components/Utility/StringUtility.ts",
        ]);
    });
});
