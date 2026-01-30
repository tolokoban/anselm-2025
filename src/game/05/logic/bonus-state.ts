export class BonusState {
    public readonly duration: number

    private timeStop = 0

    constructor(
        private readonly options: {
            duration: number
            onStart?: () => void
            onStop?: () => void
        }
    ) {
        this.duration = Math.abs(options.duration)
    }

    get active() {
        return this.timeStop > 0
    }

    start() {
        this.timeStop = -Math.abs(this.duration)
    }

    update(time: number) {
        const { timeStop } = this
        if (timeStop === 0) return

        if (timeStop < 0) {
            this.timeStop = time + Math.abs(this.duration)
            this.options.onStart?.()
        } else if (time > timeStop) {
            this.timeStop = 0
            this.options.onStop?.()
        }
    }
}
