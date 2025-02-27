import React from "react"

import { Intention } from "./intention"
import { Coords } from "@/coords"
import { Sprite } from "@/game/01/engine/sprite"
import { clamp } from "@/utils/calc"
import { EnergyBar } from "./energy-bar"
import { goto } from "@/app"
import { Cow } from "./cow"
import { pick } from "@/utils/array"
import { MANGE, VACHE } from "@/constants"
import { SoundManager } from "./sound"
import { RayManager } from "./ray"

export class Engine {
    public static use(): Engine {
        const refEngine = React.useRef<Engine | null>(null)
        if (!refEngine.current) refEngine.current = new Engine()
        React.useEffect(() => {
            const engine = refEngine.current
            if (!engine) return

            console.log("MOUNT")
            return () => {
                console.log("UNMOUNT")
                engine.detach()
                refEngine.current = null
            }
        }, [])
        return refEngine.current
    }

    private readonly ray: RayManager
    private readonly sound = new SoundManager()
    private readonly intention = new Intention()
    private readonly coords: Coords
    private readonly spaceship: Sprite
    private readonly cow: Cow
    private mode: "run" | "die" | "eat" = "run"
    private pauseAccumulator = 0
    private energy = new EnergyBar()
    private time = 0
    private laser = 0
    private dieTime = 0
    private dieY = 0
    private eatX0 = 0
    private eatY0 = 0
    private eatX1 = 0
    private eatY1 = 0
    private eatTime = 0
    private animationFrame = 0
    private _score = 0

    constructor() {
        const coords = new Coords()
        this.cow = new Cow(coords)
        this.coords = coords
        this.spaceship = new Sprite(coords, "sprite-spaceship")
        this.spaceship.update({
            x: 1920 / 2,
            y: 1080 / 3,
            width: 512,
            height: 256,
        })
        this.ray = new RayManager(this.intention, this.sound)
    }

    get score() {
        return this._score
    }
    set score(value: number) {
        this._score = value
        const div = document.getElementById("score")
        const s = value > 1 ? "s" : ""
        if (div)
            div.textContent = `${pick(VACHE)}${s} ${pick(MANGE)}${s} : ${value}`
    }

    readonly attach = (container: HTMLElement) => {
        console.log("ATTACH")
        this.intention.attach()
        this.coords.attach(container)
        this.scheduleNextFrame()
        this.energy.reset()
        this.score = 0
    }

    detach() {
        console.log("DETACH")
        this.intention.detach()
        this.coords.detach()
        window.cancelAnimationFrame(this.animationFrame)
        this.animationFrame = 0
    }

    setLaserOpacity(opacity: number) {
        if (opacity === this.laser) return

        this.laser = opacity
        const laser = document.getElementById("sprite-spaceship-laser")
        if (!laser) return

        laser.style.opacity = `${opacity}`
    }

    private scheduleNextFrame() {
        window.cancelAnimationFrame(this.animationFrame)
        this.animationFrame = window.requestAnimationFrame(this.nextFrame)
    }

    private readonly nextFrame = (time: number) => {
        this.scheduleNextFrame()
        let delay = 0
        if (this.time > 0) {
            delay = time - this.time
        }
        this.time = time
        time -= this.pauseAccumulator

        switch (this.mode) {
            case "run":
                this.doRun(time, delay)
                break
            case "die":
                this.doDie(time, delay)
                break
            case "eat":
                this.doEat(time, delay)
                break
        }
    }

    private doRun(time: number, delay: number) {
        const { intention, spaceship, cow } = this

        cow.process(time, delay)
        this.ray.process()

        const angle = 40 * Math.sin(time * 2e-3)
        let x = spaceship.x
        const speed = 3
        if (intention.wantsToGoRight()) x += delay * speed
        if (intention.wantsToGoLeft()) x -= delay * speed
        x =
            1920 / 2 +
            (Math.cos(time * (1.633e-3 + time * 2e-9)) +
                Math.sin(time * 2.904e-3)) *
                250
        this.setLaserOpacity(intention.wantsToSubdue() ? 1 : 0)
        spaceship.update({
            x: clamp(x, 300, 1620),
            rotation: angle,
        })
        let energyLoss = delay * 0.4
        if (intention.wantsToGoLeft() || intention.wantsToGoRight())
            energyLoss *= 2
        if (intention.wantsToSubdue()) {
            energyLoss *= 10
            if (cow.hit(spaceship.x, spaceship.y, spaceship.rotation)) {
                this.sound.cow.play()
                this.mode = "eat"
                this.eatX0 = cow.x
                this.eatY0 = cow.y
                this.eatX1 = spaceship.x
                this.eatY1 = spaceship.y
                this.eatTime = time
                this.score++
                return
            }
        }
        this.energy.sub(energyLoss)
        if (this.energy.value <= 0) {
            this.sound.spaceshipFall.play()
            this.mode = "die"
            this.dieTime = time
            this.dieY = spaceship.y
            this.setLaserOpacity(0)
            this.ray.stop()
        }
    }

    private doDie(time: number, delay: number) {
        const { spaceship } = this
        const rotation = spaceship.rotation + delay * 0.5
        const t = time - this.dieTime - 200
        const y = this.dieY + ((t * t - 40000) * 200) / 40000
        spaceship.update({ rotation, y })
        if (time - this.dieTime > 1000) {
            window.sessionStorage.setItem("score", `${this.score}`)
            goto("/01/dead")
            this.detach()
        }
        this.cow.process(time, delay)
    }

    private doEat(time: number, delay: number) {
        const t = Math.min(1, (time - this.eatTime) / 1000)
        const x = (this.eatX1 - this.eatX0) * t + this.eatX0
        const y = (this.eatY1 - this.eatY0) * t + this.eatY0
        this.cow.subdue(x, y, t, delay)
        if (t === 1) {
            this.mode = "run"
            this.pauseAccumulator += time - this.eatTime
            this.cow.reset(time)
            this.energy.add(2e3)
        }
    }
}
