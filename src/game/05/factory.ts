import {
    type TgdContext,
    TgdGeometryPlane,
    TgdMaterialFlatTexture,
    type TgdPainter,
    TgdPainterGroup,
    TgdPainterMesh,
    TgdPainterState,
    TgdTexture2D,
    webglPresetDepth,
} from "@tolokoban/tgd"
import BackgroundURL from "@/gfx/05/background.webp"
import { Logic } from "./logic"
import { PainterBalls } from "./painters/balls"
import { PainterBonuses } from "./painters/bonuses"
import { PainterBricks } from "./painters/bricks"
import { PainterPad } from "./painters/pad"
import type { Assets } from "./types"

export function makeLevelPainterAndLogic(
    context: TgdContext,
    assets: Assets,
    levelIndex: number
): {
    painter: TgdPainter
    logic: Logic
} {
    const bricksPainter = new PainterBricks(context, {
        atlasImage: assets.atlasBricks,
    })
    const bonusesPainter = new PainterBonuses(context, {
        atlasImage: assets.atlasBonuses,
    })
    const padPainter = new PainterPad(context, {
        atlasImage: assets.atlasPads,
    })
    const ballsPainter = new PainterBalls(context, {
        atlasImage: assets.atlasBalls,
    })
    const board = new TgdPainterMesh(context, {
        transfo: {
            position: [0, 0, -1e-1],
        },
        geometry: new TgdGeometryPlane({ sizeX: 26, sizeY: 26 }),
        material: new TgdMaterialFlatTexture({
            texture: new TgdTexture2D(context, { load: BackgroundURL }),
        }),
    })
    const painter = new TgdPainterGroup([
        new TgdPainterState(context, {
            depth: webglPresetDepth.lessOrEqual,
            children: [
                board,
                bricksPainter,
                padPainter,
                bonusesPainter,
                ballsPainter,
            ],
        }),
    ])
    const logic = new Logic(context, {
        camera: context.camera,
        levelIndex,
        balls: ballsPainter,
        bonuses: bonusesPainter,
        bricks: bricksPainter,
        pad: padPainter,
    })
    return { painter, logic }
}
