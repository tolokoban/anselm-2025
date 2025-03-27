import { Assets } from "@/components/Tgd"
import {
    TgdContext,
    TgdControllerCameraOrbit,
    TgdPainterSkybox,
    TgdQuat,
} from "@tolokoban/tgd"
import React from "react"

export function useGame() {
    const ref = React.useRef<Game | null>(null)
    if (!ref.current) ref.current = new Game()
    return ref.current as Game
}

class Game {
    readonly init = (context: TgdContext, assets: Assets) => {
        new TgdControllerCameraOrbit(context, {
            geo: {
                maxLat: 0,
                minLat: -0,
            },
        })
        const skybox = new TgdPainterSkybox(context, {
            camera: context.camera,
            imagePosX: assets.image.imagePosX,
            imagePosY: assets.image.imagePosY,
            imagePosZ: assets.image.imagePosZ,
            imageNegX: assets.image.imageNegX,
            imageNegY: assets.image.imageNegY,
            imageNegZ: assets.image.imageNegZ,
        })
        context.add(skybox)
        context.paint()
    }
}
