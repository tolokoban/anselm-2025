export class Intention {
    private intentRight = 0
    private intentLeft = 0
    private intentSubduction = 0

    attach() {
        document.addEventListener("keydown", this.handleKeyDown)
        document.addEventListener("keyup", this.handleKeyUp)
        document.body.addEventListener("pointerdown", this.handlePointerDown)
        document.body.addEventListener("pointerup", this.handlePointerUp)
        document.body.addEventListener("contextmenu", this.handleContextMenu)
    }

    detach() {
        document.removeEventListener("keydown", this.handleKeyDown)
        document.removeEventListener("keyup", this.handleKeyUp)
        document.body.removeEventListener("pointerdown", this.handlePointerDown)
        document.body.removeEventListener("pointerup", this.handlePointerUp)
        document.body.removeEventListener("contextmenu", this.handleContextMenu)
    }

    wantsToGoRight(): boolean {
        return false // this.intentRight > 0
    }

    wantsToGoLeft(): boolean {
        return false // this.intentLeft > 0
    }

    wantsToSubdue(): boolean {
        return this.intentSubduction > 0
    }

    private readonly handlePointerDown = (evt: PointerEvent) => {
        evt.preventDefault()
        evt.stopPropagation()
        this.intentSubduction = 1
    }

    private readonly handlePointerUp = () => {
        this.intentSubduction = 0
    }

    private readonly handleContextMenu = (evt: Event) => {
        evt.preventDefault()
        evt.stopPropagation()
    }

    private readonly handleKeyDown = (evt: KeyboardEvent) => {
        const time = Date.now()
        switch (evt.key) {
            case " ":
                this.intentSubduction = time
                break
            case "ArrowRight":
                this.intentRight = time
                break
            case "ArrowLeft":
                this.intentLeft = time
                break
        }
    }

    private readonly handleKeyUp = (evt: KeyboardEvent) => {
        switch (evt.key) {
            case " ":
                this.intentSubduction = 0
                break
            case "ArrowRight":
                this.intentRight = 0
                break
            case "ArrowLeft":
                this.intentLeft = 0
                break
        }
    }
}
