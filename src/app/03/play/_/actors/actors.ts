import { Assets } from "@/components/Tgd"
import {
    tgdCanvasCreateFill,
    TgdContext,
    TgdPainterClear,
    TgdPainterGroup,
    TgdPainterSkybox,
    TgdPainterState,
    webglPresetCull,
    webglPresetDepth,
} from "@tolokoban/tgd"
import { Saucer } from "./saucer"
import { Tunnel } from "./tunnel"
import { Obstacles } from "./obstacles"
import { Moon } from "./moon"

export class Actors {
    public readonly moon: Moon
    public readonly saucer: Saucer
    public readonly tunnel: Tunnel
    public readonly obstacles: Obstacles

    private readonly groupInterior: TgdPainterGroup
    private readonly groupExterior: TgdPainterGroup

    constructor(context: TgdContext, assets: Assets) {
        this.moon = new Moon(context, assets.glb.moon)
        this.saucer = new Saucer(context, assets.glb.saucer)
        this.tunnel = new Tunnel(context, assets.glb.tunnel)
        this.obstacles = new Obstacles(context, assets.glb.obstacle)

        const { width, height } = assets.image.imageNegZ
        const black = tgdCanvasCreateFill(width, height)
        const skybox = new TgdPainterSkybox(context, {
            camera: context.camera,
            imagePosX: black,
            imagePosY: black,
            imagePosZ: black,
            imageNegX: black,
            imageNegY: black,
            imageNegZ: assets.image.imageNegZ,
        })
        this.groupInterior = new TgdPainterGroup(
            [this.tunnel, this.obstacles],
            { name: "Interior" }
        )
        this.groupInterior.active = false
        this.groupExterior = new TgdPainterGroup([this.moon, skybox], {
            name: "Exterior",
        })
        this.groupExterior.active = false

        const clear = new TgdPainterClear(context, {
            depth: 1,
            color: [0, 0, 0, 1],
        })
        const state = new TgdPainterState(context, {
            depth: webglPresetDepth.lessOrEqual,
            cull: webglPresetCull.back,
            children: [this.groupInterior, this.groupExterior, this.saucer],
        })

        context.add(clear, state)
        this.step = "exterior"
    }

    set step(value: "interior" | "exterior") {
        this.groupExterior.active = value === "exterior"
        this.groupInterior.active = value === "interior"
    }
}
