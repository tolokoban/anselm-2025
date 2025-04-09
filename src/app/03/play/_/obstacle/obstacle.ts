import {
    tgdCalcSmoothStep,
    TgdContext,
    TgdDataGlb,
    TgdPainter,
    TgdPainterMeshGltf,
} from "@tolokoban/tgd"
import { Material } from "./material"

export class Obstacle extends TgdPainter {
    private readonly painter: TgdPainterMeshGltf
    private x = 0
    private y = 0
    private z = 0

    constructor(context: TgdContext, asset: TgdDataGlb) {
        super()
        const painter = new TgdPainterMeshGltf(context, {
            asset,
            materialFactory: ({ color }) => {
                const material = new Material({ color })
                return material
            },
        })
        painter.transfo.setPosition(0, 0, 0)
        this.painter = painter
        this.reset()
    }

    reset() {
        this.x = 2 * (Math.random() - 0.5)
        this.z = -200 - 20 * Math.random()
    }

    delete(): void {}

    paint(time: number, delay: number): void {
        const { painter, x, y, z } = this
        const { transfo } = painter
        const light = tgdCalcSmoothStep(-200, 0, z)
        const material = painter.material as Material
        material.light = light
        transfo.setPosition(x * 10, y, z)
        transfo.setEulerRotation(79 * time, 47 * time, 19 * time)
        painter.paint(time, delay)
        const speed = 75
        this.z += delay * speed
        if (this.z > 20) this.reset()
    }
}
