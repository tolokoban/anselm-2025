/**
 * All screens are different, but we want to use a system of coordinates that
 * makes us believe we are using a 1920x1080 viewport.
 * This class will do the convertion into the actual coordinates in pixels.
 * The viewport is supposed to be contained inside of the actual view,
 * and the view is always in landscape orientation.
 */
export class Coords {
    private readonly observer: ResizeObserver
    private element: HTMLElement | null = null
    private readonly transform: {
        x: number
        y: number
        scale: number
    } = { x: 0, y: 0, scale: 1 }

    constructor(
        public readonly logicalWidth = 1920,
        public readonly logicalHeight = 1080
    ) {
        this.observer = new ResizeObserver(this.handleResize)
    }

    x(logicalX: number) {
        const { scale, x } = this.transform
        return logicalX * scale + x
    }

    y(logicalY: number) {
        const { scale, y } = this.transform
        return logicalY * scale + y
    }

    width(logicalWidth: number) {
        return logicalWidth * this.transform.scale
    }

    hight(logicalHeight: number) {
        return logicalHeight * this.transform.scale
    }

    attach(element: HTMLElement) {
        this.detach()
        this.element = element
        this.observer.observe(element)
        this.handleResize()
    }

    detach() {
        if (this.element) {
            this.observer.unobserve(this.element)
            this.element = null
        }
    }

    private readonly handleResize = () => {
        const { element } = this
        if (!element) return

        const rect = element.getBoundingClientRect()
        const width = Math.max(rect.width, rect.height)
        const height = Math.min(rect.width, rect.height)
        const scaleW = width / this.logicalWidth
        const scaleH = height / this.logicalHeight
        const scale = Math.min(scaleW, scaleH)
        this.transform.x = (width - this.logicalWidth * scale) / 2
        this.transform.y = (height - this.logicalHeight * scale) / 2
        this.transform.scale = scale
    }
}
