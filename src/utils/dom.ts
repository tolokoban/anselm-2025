export function byId(id: string): HTMLElement {
    const elem = globalThis.document.getElementById(id)
    if (!elem) throw new Error(`No HTML element with id #${id} has been found!`)

    return elem
}
