export function pick<T>(arr: T | T[]): T {
    if (!Array.isArray(arr)) return arr

    const i = Math.floor(Math.random() * arr.length)
    return arr[i]
}
