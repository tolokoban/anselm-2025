import BounceURL from "./bounce.mp3"
import GlassURL from "./glass.mp3"
import PopURL from "./pop.mp3"
import UnbreakableURL from "./unbreakable.mp3"

class MultiSound {
    private readonly audios: HTMLAudioElement[] = []
    private index = 0

    constructor(url: string) {
        for (let loop = 0; loop < 16; loop++) {
            this.audios.push(new Audio(url))
        }
    }

    play() {
        const audio = this.audios[this.index++]
        audio.currentTime = 0
        audio.play()
        this.index %= this.audios.length
    }
}

class LogicSound {
    public readonly bounce = new MultiSound(BounceURL)
    public readonly glass = new MultiSound(GlassURL)
    public readonly pop = new MultiSound(PopURL)
    public readonly unbreakable = new MultiSound(UnbreakableURL)

    constructor() {}
}

export const Sound = new LogicSound()
