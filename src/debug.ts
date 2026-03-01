const debugMode = globalThis.localStorage.getItem("debug") !== null

export function isDebugMode() {
    return debugMode
}
