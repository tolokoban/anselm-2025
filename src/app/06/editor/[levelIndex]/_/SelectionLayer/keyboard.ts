import React from "react"

export function useKeyboard(listeners: Record<string, () => void>) {
    React.useEffect(() => {
        const handleKeyDown = (evt: KeyboardEvent) => {
            let id = evt.key
            if (evt.shiftKey) id = `S-${id}`
            if (evt.altKey) id = `A-${id}`
            const action = listeners[id]
            if (action) {
                evt.stopPropagation()
                evt.preventDefault()
                action()
            } else {
                console.log("🐞 [keyboard@8] id =", id) // @FIXME: Remove this line written on 2026-02-12 at 10:04
            }
        }
        globalThis.document.addEventListener("keydown", handleKeyDown)
        return () => {
            globalThis.document.removeEventListener("keydown", handleKeyDown)
        }
    }, [listeners])
}
