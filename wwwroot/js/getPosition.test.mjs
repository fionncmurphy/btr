/**
 * AI Disclosure:
 * This test file was generated with assistance from ChatGPT based on the
 * provided getPosition and permissionStatus functions.
 */

import { getPosition, permissionStatus } from "./geo.js";

// Helper to mock geolocation
function mockGeolocation(success = true, position = {}, error = {}) {
    global.navigator = {
        geolocation: {
            getCurrentPosition: jest.fn((onSuccess, onError, opts) => {
                if (success) {
                    onSuccess({
                        coords: {
                            latitude: position.lat,
                            longitude: position.lon,
                            accuracy: position.accuracy,
                        },
                    });
                } else {
                    onError(error);
                }
            }),
        },
    };
}

describe("getPosition", () => {

    test("resolves with latitude, longitude, and accuracy when geolocation succeeds", async () => {
        mockGeolocation(true, {
            lat: 37.123,
            lon: -80.543,
            accuracy: 15
        });

        const result = await getPosition();

        expect(result).toEqual({
            lat: 37.123,
            lon: -80.543,
            accuracy: 15
        });
    });

    test("returns accuracy = null when pos.coords.accuracy is null", async () => {
        mockGeolocation(true, {
            lat: 10,
            lon: 20,
            accuracy: null
        });

        const result = await getPosition();

        expect(result).toEqual({
            lat: 10,
            lon: 20,
            accuracy: null
        });
    });

    test("rejects when geolocation API errors", async () => {
        mockGeolocation(false, {}, { code: 1, message: "User denied" });

        await expect(getPosition()).rejects.toEqual({ code: 1, message: "User denied" });
    });

    test("throws if geolocation is not supported", async () => {
        global.navigator = {}; // no geolocation

        await expect(getPosition()).rejects.toThrow("Geolocation not supported");
    });

    test("uses default options when options === null", async () => {
        mockGeolocation(true, {
            lat: 1,
            lon: 2,
            accuracy: 3
        });

        await getPosition(null);

        expect(navigator.geolocation.getCurrentPosition)
            .toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
    });

    test("passes through provided options", async () => {
        mockGeolocation(true, {
            lat: 5,
            lon: 6,
            accuracy: 7
        });

        const customOptions = { enableHighAccuracy: false, timeout: 5000 };

        await getPosition(customOptions);

        expect(navigator.geolocation.getCurrentPosition)
            .toHaveBeenCalledWith(expect.any(Function), expect.any(Function), customOptions);
    });

});


// -------------------------------
// permissionStatus Tests
// -------------------------------

describe("permissionStatus", () => {

    test("returns 'granted', 'prompt', or 'denied' when permissions API is available", async () => {
        global.navigator = {
            permissions: {
                query: jest.fn().mockResolvedValue({ state: "granted" })
            }
        };

        const result = await permissionStatus();
        expect(result).toBe("granted");
    });

    test("returns 'unknown' when navigator.permissions does not exist", async () => {
        global.navigator = {};

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
