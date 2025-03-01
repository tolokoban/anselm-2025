import { Translation } from "./lang"

export function translateInAlienLanguage<T extends Translation>(input: T): T {
    const output: Translation = {}
    for (const key of Object.keys(input)) {
        const val = input[key]
        if (Array.isArray(val)) {
            output[key] = val.map(translate)
        } else {
            output[key] = translate(val)
        }
    }
    return output as T
}

function translate(text: string): string {
    const words = text
        .split(/[^a-z]+/gi)
        .map((word) => word.toLocaleLowerCase())
    return words
        .map((word) =>
            word
                .split("")
                .map((letter) =>
                    letter.charCodeAt(0) > 10240
                        ? letter
                        : String.fromCharCode(10240 + letter.charCodeAt(0))
                )
                .join("")
        )
        .join(" ")
}
