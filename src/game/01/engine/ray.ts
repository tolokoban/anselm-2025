import { SoundManager } from "./sound"
import { Intention } from "./intention"

export class RayManager {
    private rayActive = false

    constructor(
        private readonly intention: Intention,
        private readonly sound: SoundManager
    ) {}

    process() {
        const { ray } = this.sound
        const subdue = this.intention.wantsToSubdue()
        if (subdue && !this.rayActive) {
            this.rayActive = true
            ray.currentTime = 0
            ray.play()
        } else if (!subdue && this.rayActive) {
            this.rayActive = false
            ray.pause()
        }
    }

    stop() {
        this.sound.ray.pause()
    }
}
