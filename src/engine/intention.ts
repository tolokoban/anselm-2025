export class Intention {
    private intentRight = 0
    private intentLeft = 0
    private intentSubduction = 0

    attach() {
        document.addEventListener("keydown", this.handleKeyDown)
        document.addEventListener("keyup", this.handleKeyUp)
    }

    detach() {
        document.removeEventListener("keydown", this.handleKeyDown)
        document.removeEventListener("keyup", this.handleKeyUp)
    }

    wantsToGoRight(): boolean {}

    wantsToGoLeft(): boolean {}

    wantsToSubdue(): boolean {}

    private readonly handleKeyDown = (evt: KeyboardEvent) => {
        const time = Date.now()
        switch (evt.key) {
            case "Space":
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
            case "Space":
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
