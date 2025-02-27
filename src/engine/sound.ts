import SpaceshipFallURL from "@/gfx/sound/spaceship-fall.mp3"
import Cow1URL from "@/gfx/sound/cow-1.mp3"
import Cow2URL from "@/gfx/sound/cow-2.mp3"
import Cow3URL from "@/gfx/sound/cow-3.mp3"
import Cow4URL from "@/gfx/sound/cow-4.mp3"
import Cow5URL from "@/gfx/sound/cow-5.mp3"
import Cow6URL from "@/gfx/sound/cow-6.mp3"
import Cow7URL from "@/gfx/sound/cow-7.mp3"
import Cow8URL from "@/gfx/sound/cow-8.mp3"
import RayURL from "@/gfx/sound/ray.mp3"

import { pick } from "@/utils/array"

export class SoundManager {
    readonly spaceshipFall = load(SpaceshipFallURL)
    readonly ray = load(RayURL)

    private readonly cows = [
        load(Cow1URL),
        load(Cow2URL),
        load(Cow3URL),
        load(Cow4URL),
        load(Cow5URL),
        load(Cow6URL),
        load(Cow7URL),
        load(Cow8URL),
    ]

    get cow() {
        return pick(this.cows)
    }
}

function load(url: string) {
    return new Sound(url)
}

class Sound {
    private readonly audio: HTMLAudioElement

    constructor(url: string) {
        this.audio = new Audio(url)
    }

    get currentTime() {
        return this.audio.currentTime
    }
    set currentTime(t: number) {
        this.audio.currentTime = t
    }

    play() {
        try {
            this.audio.play()
        } catch (ex) {}
    }

    pause() {
        try {
            this.audio.pause()
        } catch (ex) {}
    }
}
