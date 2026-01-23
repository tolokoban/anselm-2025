const RX_SEP = /[^a-z0-9]+/gi

export function camelCase(name: string) {
    RX_SEP.lastIndex = -1
    return name
        .trim()
        .split(RX_SEP)
        .map((part, index) =>
            index === 0 ? part.toLowerCase() : capitalize(part.toLowerCase())
        )
        .join("")
}

export function pascalCase(name: string) {
    return capitalize(camelCase(name))
}

/**
 * Make the first character uppercase.
 */
export function capitalize(name: string) {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
}
