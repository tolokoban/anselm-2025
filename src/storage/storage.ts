export const GameStorage = {
    ep01: make(1, {
        highscore: 0,
        total: 0,
    }),
}

function make<T extends Record<string, string | number>>(
    episode: number,
    defaultValues: T
): T & { $reset: () => void } {
    const get = (key: string) =>
        localStorage.getItem(`Ansy-2025/${episode}/${key}`)
    const set = (key: string, val: string) =>
        localStorage.setItem(`Ansy-2025/${episode}/${key}`, val)
    const obj = {
        $reset() {},
    } as Record<string, string | number> & { $reset: () => void }
    for (const key of Object.keys(defaultValues)) {
        const defVal = defaultValues[key]
        if (typeof defVal === "string") {
            Object.defineProperty(obj, key, {
                configurable: false,
                enumerable: true,
                get: () => {
                    const val = get(key)
                    return typeof val === "string" ? val : defVal
                },
                set: (val: string) => {
                    set(key, val)
                },
            })
        } else {
            Object.defineProperty(obj, key, {
                configurable: false,
                enumerable: true,
                get: () => {
                    const val = Number(get(key))
                    return Number.isNaN(val) ? defVal : val
                },
                set: (val: number) => {
                    set(key, `${val}`)
                },
            })
        }
    }
    obj.$reset = () => {
        for (const key of Object.keys(defaultValues)) {
            const val = defaultValues[key]
            obj[key] = val
        }
    }

    return obj as T & { $reset: () => void }
}
