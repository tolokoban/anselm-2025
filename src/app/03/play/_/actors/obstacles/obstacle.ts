import {
    tgdCalcRandom,
    tgdCalcSmoothStep,
    TgdContext,
    TgdDataGlb,
    TgdPainter,
    TgdPainterMeshGltf,
} from "@tolokoban/tgd"
import { Material } from "./material"

export class Obstacle extends TgdPainter {
    public speed = 100
    public time0 = 0

    private readonly painter: TgdPainterMeshGltf
    private _x = 0
    private y = 0
    private _z = 0
    private rotX = 0
    private rotY = 0
    private rotZ = 0

    constructor(context: TgdContext, asset: TgdDataGlb, shift = 0) {
        super()
        const painter = new TgdPainterMeshGltf(context, {
            asset,
            material: ({ color }) => {
                const material = new Material({ color })
                return material
            },
        })
        painter.transfo.setPosition(0, 0, 0)
        this.painter = painter
        this.reset(shift)
    }

    hitTest({ x, z }: { x: number; y: number; z: number }) {
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
        this._x = tgdCalcRandom(-8, +8)
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
        const material = painter.material as Material
        material.light = light
        transfo.setPosition(x, y, z)
        transfo.setEulerRotation(rotX * time, rotY * time, rotZ * time)
        painter.paint(time, delay)
        this._z += delay * speed * 1e3
        if (this._z > 20) this.reset()
    }
}
