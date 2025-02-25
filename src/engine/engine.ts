import React from "react"

import { Intention } from "./intention"
import { Coords } from "@/coords"
import { Sprite } from "@/engine/sprite"
import { clamp } from "@/utils/calc"
import { EnergyBar } from "./energy-bar"

const MAX_ENERGY = 10000
export class Engine {
    private energy = new EnergyBar()
    private time = 0
    private laser = 0

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

    private readonly intention = new Intention()
    private readonly coords: Coords
    private readonly spaceship: Sprite
    private animationFrame = 0

    constructor() {
        const coords = new Coords()
        this.coords = coords
        this.spaceship = new Sprite(coords, "sprite-spaceship")
        this.spaceship.update({
            x: 1920 / 2,
            y: 1080 / 3,
            width: 512,
            height: 256,
        })
    }

    readonly attach = (container: HTMLElement) => {
        console.log("ATTACH")
        this.intention.attach()
        this.coords.attach(container)
        this.scheduleNextFrame()
        this.energy.reset()
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
        let delay = 0
        if (this.time > 0) {
            delay = time - this.time
        }
        this.time = time
        const angle = 40 * Math.sin(time * 2e-3)
        this.scheduleNextFrame()
        let x = this.spaceship.x
        const { intention } = this
        const speed = 3
        if (intention.wantsToGoRight()) x += delay * speed
        if (intention.wantsToGoLeft()) x -= delay * speed
        this.setLaserOpacity(intention.wantsToSubdue() ? 1 : 0)
        this.spaceship.update({
            x: clamp(x, 300, 1620),
            rotation: angle,
        })
        let energyLoss = delay * 0.4
        if (intention.wantsToGoLeft() || intention.wantsToGoRight())
            energyLoss *= 2
        if (intention.wantsToSubdue()) energyLoss *= 10
        this.energy.sub(energyLoss)
    }
}
