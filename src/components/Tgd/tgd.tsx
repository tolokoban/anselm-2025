import React from "react"
import {
    tgdActionCreateCameraInterpolation,
    TgdCameraPerspective,
    TgdCanvasGizmo,
    TgdContext,
    tgdEasingFunctionInOutCubic,
    tgdLoadArrayBuffer,
    tgdLoadGlb,
    tgdLoadImage,
    TgdParserGLTransfertFormatBinary,
} from "@tolokoban/tgd"

import { isString } from "@tolokoban/type-guards"
import Spinner from "@/components/Spinner"

import styles from "./tgd.module.css"
import { classNames } from "@/utils/class-names"

export interface Assets {
    image: Record<string, HTMLImageElement>
    glb: Record<string, TgdParserGLTransfertFormatBinary>
    data: Record<string, ArrayBuffer>
}

type AssetsToLoad = { [key in keyof Assets]: Record<string, string> }

interface TgdProps {
    className?: string
    options?: WebGLContextAttributes
    onReady(scene: TgdContext, assets: Assets): void
    assets?: Partial<AssetsToLoad>
    children?: React.ReactNode
    gizmo?: boolean
}
export default function Tgd({
    className,
    options,
    onReady,
    assets,
    children,
    gizmo = false,
}: TgdProps) {
    const [, setFullscreenAvailable] = React.useState(false)
    const refContext = React.useRef<TgdContext | null>(null)
    const refCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const refGizmo = React.useRef<TgdCanvasGizmo | null>(null)
    const [loading, setLoading] = React.useState(true)
    const mountCanvas = (canvas: HTMLCanvasElement) => {
        if (!canvas) return

        if (refCanvas.current) return

        refCanvas.current = canvas
        const context = new TgdContext(canvas, options)
        refContext.current = context
        context.inputs.keyboard.eventKeyPress.addListener((event) => {
            if (event.key === "?") {
                const { camera } = context
                if (camera instanceof TgdCameraPerspective) {
                    console.log(`new TgdCameraPerspective({
  fovy: ${camera.fovy},
  near: ${camera.near},
  far: ${camera.far},
  zoom: ${camera.zoom},
  transfo: {
    distance: ${camera.transfo.distance},
    position: ${JSON.stringify(Array.from(camera.transfo.position))},
    orientation: ${JSON.stringify(Array.from(camera.transfo.orientation))},
    scale: ${JSON.stringify(Array.from(camera.transfo.scale))}
  }
})`)
                }

                console.log("Camera:", context.camera.getCurrentState())
            }
        })
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
    const mountGizmo = (canvas: HTMLCanvasElement) => {
        const gizmo = new TgdCanvasGizmo({
            canvas,
        })
        refGizmo.current = gizmo
        gizmo.eventTipClick.addListener(({ to }) => {
            const context = refContext.current
            console.log("🚀 [tgd] to, context =", to, context) // @FIXME: Remove this line written on 2025-03-29 at 10:43
            if (!context) return

            context.animSchedule({
                duration: 0.2,
                easingFunction: tgdEasingFunctionInOutCubic,
                action: tgdActionCreateCameraInterpolation(context.camera, {
                    orientation: to,
                }),
            })
        })
        const context = refContext.current
        if (context) gizmo.attachContext(context)
    }

    return (
        <div className={[className, styles.Tgd].filter(isString).join(" ")}>
            <canvas className={styles.scene} ref={mountCanvas}></canvas>
            {gizmo && (
                <canvas className={styles.gizmo} ref={mountGizmo}></canvas>
            )}
            <div
                className={classNames(styles.spinner, !loading && styles.hide)}
            >
                <Spinner />
                <div>Loading in progress...</div>
            </div>
        </div>
    )
}

async function loadAssets({
    glb,
    data,
    image,
}: Partial<AssetsToLoad> = {}): Promise<Assets> {
    console.log("🚀 [Tgd] glb, data, image = ", glb, data, image) // @FIXME: Remove this line written on 2024-11-08 at 14:33
    const assets: Assets = { glb: {}, data: {}, image: {} }
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
