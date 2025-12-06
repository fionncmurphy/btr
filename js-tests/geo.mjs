export async function getPosition(
    options =
        undefined
){

    if (!("geolocation" in navigator)) {
        throw new Error("Geolocation not supported");
    }

    var defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
    }

    var endOptions;
    if (options === null) {
        endOptions = defaultOptions;
    } else {
        endOptions = options;
    }

    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            function(pos){
                var accuracyVal;
                if (pos.coords.accuracy == null) {
                    accuracyVal = null;
                } else {
                    accuracyVal = pos.coords.accuracy;
                }

                var results = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    accuracy: accuracyVal
                };
                resolve(results);
            },
            function(err) {
                reject(err);
            },
            endOptions
        );
    });
}

export async function permissionStatus() {
    try {
        if (!navigator.permissions) {
            return "unknown";
        }
        var p = await navigator.permissions.query({ name: "geolocation" });
        return p.state; // "granted" | "prompt" | "denied"
    } catch { return "unknown"; }
}
