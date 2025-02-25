import { Coords } from "@/coords"
import { Sprite } from "./sprite"
import { deg2rad } from "@/utils/calc"

export class Cow {
    private time0 = 0
    private readonly sprite: Sprite

    constructor(coords: Coords) {
        const sprite = new Sprite(coords, "sprite-cow")
        this.sprite = sprite
        sprite.update({
            x: 1920 / 2,
            y: (2 * 1080) / 3,
            width: 256,
            height: 128,
        })
    }

    get x() {
        return this.sprite.x
    }
    get y() {
        return this.sprite.y
    }

    reset(startingTime: number) {
        this.time0 = startingTime
        this.sprite.update({ scaleX: 1, scaleY: 1 })
    }

    update(time: number, delay: number) {
        time -= this.time0
        const { sprite } = this
        const W = 1920
        const lapse = 4000
        const t = (time % lapse) / lapse
        const x = 2 * W * t - W / 2
        const ang = time * 0.005
        const y =
            (2 * 1080) / 3 -
            2 * (sprite.height * Math.abs(Math.sin(ang)) - sprite.height)
        const rotation = Math.cos(ang * 2) * 30
        sprite.update({
            x,
            y,
            rotation,
        })
    }

    subdue(x: number, y: number, t: number, d: number) {
        const scale = 1 - t * 0.9
        this.sprite.update({
            x,
            y,
            rotation: this.sprite.rotation + d * 0.5,
            scaleX: scale,
            scaleY: scale,
        })
    }

    hit(xShip: number, yShip: number, rotation: number): boolean {
        const { sprite } = this
        const xCow = sprite.x
        const yCow = sprite.y
        const ang = deg2rad(rotation)
        const vx = -Math.sin(ang)
        const vy = Math.cos(ang)
        const AMx = xCow - xShip
        const AMy = yCow - yShip
        const dist = Math.abs(AMx * vy - AMy * vx)
        return dist < sprite.height * 0.2
    }
}
