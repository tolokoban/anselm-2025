export function clamp(value: number, min: number, max: number) {
    if (value < min) return min
    if (value > max) return max
    return value
}

export function deg2rad(deg: number) {
    return (deg * Math.PI) / 180
}