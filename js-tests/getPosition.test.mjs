import { jest } from "@jest/globals";
import { getPosition, permissionStatus } from "./geo.mjs";

// Reset navigator before each test
beforeEach(() => {
    global.navigator = {};
});

// ─────────────────────────────────────────────────────────────
// getPosition
// ─────────────────────────────────────────────────────────────

describe("getPosition", () => {
    test("throws if geolocation is not supported", async () => {
        // navigator = {} → no geolocation
        await expect(getPosition()).rejects.toThrow("Geolocation not supported");
    });
});

// ─────────────────────────────────────────────────────────────
// permissionStatus
// ─────────────────────────────────────────────────────────────

describe("permissionStatus", () => {
    test("returns 'unknown' when navigator.permissions does not exist", async () => {
        global.navigator = {}; // no permissions API
        const result = await permissionStatus();
        expect(result).toBe("unknown");
    });

    test("returns 'unknown' when navigator.permissions.query throws", async () => {
        global.navigator = {
            permissions: {
                query: jest.fn().mockRejectedValue(new Error("fail"))
            }
        };

        const result = await permissionStatus();
        expect(result).toBe("unknown");
    });
});
