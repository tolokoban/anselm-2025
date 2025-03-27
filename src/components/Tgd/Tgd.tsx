import React from "react"
import {
    TgdContext,
    tgdLoadArrayBuffer,
    tgdLoadGlb,
    tgdLoadImage,
    TgdParserGLTransfertFormatBinary,
} from "@tolokoban/tgd"

import styles from "./tgd.module.css"
import { isString } from "@tolokoban/type-guards"

export interface Assets {
    image: Record<string, HTMLImageElement>
    glb: Record<string, TgdParserGLTransfertFormatBinary>
    data: Record<string, ArrayBuffer>
}

type AssetsToLoad = {
    [key in keyof Assets]: Record<string, string>
}

interface TgdProps {
    className?: string
    options?: WebGLContextAttributes
    onReady(scene: TgdContext, assets: Assets): void
    assets?: Partial<AssetsToLoad>
    children?: React.ReactNode
}
export default function Tgd({
    className,
    options,
    onReady,
    assets,
    children,
}: TgdProps) {
    const [fullscreenAvailable, setFullscreenAvailable] = React.useState(false)
    const refContext = React.useRef<TgdContext | null>(null)
    const refCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const [loading, setLoading] = React.useState(true)
    let aspectRatio = "auto"
    const mountCanvas = (canvas: HTMLCanvasElement) => {
        if (!canvas) return

        if (refCanvas.current) return

        refCanvas.current = canvas
        const context = new TgdContext(canvas, options)
        refContext.current = context
        setLoading(true)
        loadAssets(assets)
            .then((loadedAssets: Assets) => {
                console.log("Ready!")
                onReady(context, loadedAssets)
                context.paint()
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }
    React.useEffect(() => {
        const canvas = refCanvas.current
        const scene = refContext.current
        if (!canvas || !scene) return

        const observer = new ResizeObserver(() => scene.paint())
        observer.observe(canvas)
        if (!canvas.requestFullscreen) {
            canvas.requestFullscreen = (
                canvas as unknown as Record<string, unknown>
            )["webkitRequestFullscreen"] as (
                options?: FullscreenOptions
            ) => Promise<void>
        }
        setFullscreenAvailable(Boolean(canvas.requestFullscreen))
        return () => observer.unobserve(canvas)
    }, [refContext.current, refCanvas.current])
    return (
        <canvas
            className={[className, styles.Tgd].filter(isString).join(" ")}
            ref={mountCanvas}
        ></canvas>
    )
}

async function loadAssets({
    glb,
    data,
    image,
}: Partial<AssetsToLoad> = {}): Promise<Assets> {
    console.log("🚀 [Tgd] glb, data, image = ", glb, data, image) // @FIXME: Remove this line written on 2024-11-08 at 14:33
    const assets: Assets = {
        glb: {},
        data: {},
        image: {},
    }
    const loaders: Array<() => Promise<void>> = []
    if (image) {
        Object.keys(image).forEach((key) => {
            loaders.push(async () => {
                const url = image[key]
                console.log("Loading image:", url)
                const asset = await tgdLoadImage(url)
                if (asset) assets.image[key] = asset
            })
        })
    }
    if (glb) {
        Object.keys(glb).forEach((key) => {
            loaders.push(async () => {
                const url = glb[key]
                console.log("Loading GLB:", url)
                const asset = await tgdLoadGlb(url)
                if (asset) assets.glb[key] = asset
            })
        })
    }
    if (data) {
        Object.keys(data).forEach((key) => {
            loaders.push(async () => {
                const url = data[key]
                const asset = await tgdLoadArrayBuffer(url)
                if (asset) assets.data[key] = asset
            })
        })
    }
    await Promise.all(loaders.map((loader) => loader()))
    return assets
}
