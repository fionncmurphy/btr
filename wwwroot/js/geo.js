export async function getPosition(options) {
    if (!("geolocation" in navigator)) throw new Error("Geolocation not supported");
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                accuracy: pos.coords.accuracy ?? null
            }),
            (err) => reject(err),
            options ?? { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
}

export async function permissionStatus() {
    try {
        if (!navigator.permissions) return "unknown";
        const p = await navigator.permissions.query({ name: "geolocation" });
        return p.state; // "granted" | "prompt" | "denied"
    } catch { return "unknown"; }
}
