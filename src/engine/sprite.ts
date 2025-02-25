import { Coords } from "../coords"

export interface SpriteStatus {
    x: number
    y: number
    width: number
    height: number
    rotation: number
    scaleX: number
    scaleY: number
}

export class Sprite {
    private status: SpriteStatus = {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
    }

    constructor(
        private readonly coords: Coords,
        private readonly elementId: string
    ) {}

    get x() {
        return this.status.x
    }
    get y() {
        return this.status.y
    }
    get width() {
        return this.status.width
    }
    get height() {
        return this.status.height
    }
    get rotation() {
        return this.status.rotation
    }

    update(data: Partial<SpriteStatus>): boolean {
        this.status = {
            ...this.status,
            ...data,
        }
        const { element, coords, status } = this
        if (!element) return false

        const x = coords.x(status.x)
        const y = coords.y(status.y)
        const width = coords.width(status.width) * status.scaleX
        const height = coords.width(status.height) * status.scaleY
        element.style.left = `${x - width / 2}px`
        element.style.top = `${y - height / 2}px`
        element.style.width = `${width}px`
        element.style.height = `${height}px`
        element.style.transform = `rotate(${status.rotation}deg)`
        return true
    }

    private get element() {
        const element = document.getElementById(this.elementId)
        if (!element) console.error("No element with this id:", this.elementId)
        return element
    }
}
