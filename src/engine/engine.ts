import React from "react"
import {
    TgdContext,
    tgdLoadImage,
    TgdPainterBackground,
    TgdTexture2D,
} from "@tolokoban/tgd"

import { Intention } from "./intention"
import { PainterSpaceshift } from "./painters/spaceship"

import BackgroundURL from "@/gfx/background.webp"

export class Engine {
    private readonly intention = new Intention()
    private context: TgdContext | null = null

    public static use(): Engine {
        const refEngine = React.useRef<Engine | null>(null)
        if (!refEngine.current) refEngine.current = new Engine()
        // React.useEffect(() => {
        //     console.log("MOUNT")
        //     return () => {
        //         console.log("UNMOUNT")
        //         refEngine.current?.detach()
        //         refEngine.current = null
        //     }
        // }, [])
        return refEngine.current
    }

    readonly attach = (canvas: HTMLCanvasElement) => {
        console.log("ATTACH")
        this.intention.attach()
        if (this.context) this.context.destroy()
        const context = new TgdContext(canvas)
        this.context = context
        const spaceship = new PainterSpaceshift(context, this.intention)
        const texture = new TgdTexture2D(context)
        texture.loadBitmap(tgdLoadImage(BackgroundURL))
        const background = new TgdPainterBackground(context, texture)
        context.add(background, spaceship)
        context.play()
    }

    detach() {
        console.log("DETACH")
        this.intention.detach()
        if (this.context) {
            this.context.destroy()
            this.context = null
        }
    }
}
