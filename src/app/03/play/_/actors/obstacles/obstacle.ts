import {
    tgdCalcMix,
    tgdCalcRandom,
    tgdCalcSmoothStep,
    TgdContext,
    TgdDataGlb,
    tgdMakeMeshGlbPainter,
    TgdPainter,
    TgdPainterNode,
} from "@tolokoban/tgd"
import { Material } from "./material"

export class Obstacle extends TgdPainter {
    public speed = 100
    public time0 = 0
    public loop = true

    private readonly painter: TgdPainterNode
    private _x = 0
    private y = 0
    private _z = 0
    private rotX = 0
    private rotY = 0
    private rotZ = 0
    private material: Material | null = null
    private saucerX = 0

    constructor(context: TgdContext, asset: TgdDataGlb, shift = 0) {
        super()
        const { painter } = tgdMakeMeshGlbPainter({
            context,
            data: asset,
            node: 0,
            overrideMaterial:
                () =>
                ({ color }) => {
                    const material = new Material({ color })
                    this.material = material
                    return material
                },
        })
        painter.transfo.setPosition(0, 0, 0)
        this.painter = painter
        this.reset(shift)
    }

    hitTest({ x, z }: { x: number; y: number; z: number }) {
        this.saucerX = x
        const dist = 2
        if (Math.abs(z - this._z) > dist) return false
        return Math.abs(x - this._x) < dist
    }

    get x() {
        return this._x
    }
    private set x(value: number) {
        this._x = value
    }

    get z() {
        return this._z
    }
    private set z(value: number) {
        this._z = value
    }

    reset(shift = 0) {
        this._x = tgdCalcMix(this.saucerX, tgdCalcRandom(-8, +8), Math.random())
        this.y = (1 - Math.abs(this._x) / 8) * tgdCalcRandom(-3, +3)
        this._z = -200 * (1 + shift)
        this.rotX = tgdCalcRandom(-240, +240)
        this.rotY = tgdCalcRandom(-240, +240)
        this.rotZ = tgdCalcRandom(-240, +240)
        this.painter.transfo.setScale(
            tgdCalcRandom(0.7, 1.1),
            tgdCalcRandom(0.7, 1.1),
            tgdCalcRandom(0.7, 1.1)
        )
    }

    delete(): void {}

    paint(time: number, delay: number): void {
        const { painter, _x: x, y, _z: z, rotX, rotY, rotZ, speed } = this
        const { transfo } = painter
        const light = tgdCalcSmoothStep(-200, 0, z)
        const material = this.material
        if (material) material.light = light
        transfo.setPosition(x, y, z)
        transfo.setEulerRotation(rotX * time, rotY * time, rotZ * time)
        painter.paint(time, delay)
        this._z += delay * speed
        if (this._z > 20 && this.loop) this.reset()
    }
}
