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
    private x = 0
    private y = 0
    private z = 0
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

    reset(shift = 0) {
        this.x = tgdCalcRandom(-1, +1)
        this.y = (1 - Math.abs(this.x)) * tgdCalcRandom(-3, +3)
        this.z = -200 * (1 + shift)
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
        const { painter, x, y, z, rotX, rotY, rotZ, speed, time0 } = this
        time -= time0
        const { transfo } = painter
        const light = tgdCalcSmoothStep(-200, 0, z)
        const material = painter.material as Material
        material.light = light
        transfo.setPosition(x * 10, y, z)
        transfo.setEulerRotation(rotX * time, rotY * time, rotZ * time)
        painter.paint(time, delay)
        this.z += delay * speed
        if (this.z > 20) this.reset()
    }
}
