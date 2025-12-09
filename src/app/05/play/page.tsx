import React from "react"
import { TgdDataGlb, tgdLoadAssets, tgdLoadGlb } from "@tolokoban/tgd"

import Spinner from "./_/Spinner"
import Game from "./_/Game"

import AssetURL from "./_/assets/asset.glb"
import PosX from "./_/assets/sky/posX.webp"
import PosY from "./_/assets/sky/posY.webp"
import PosZ from "./_/assets/sky/posZ.webp"
import NegX from "./_/assets/sky/negX.webp"
import NegY from "./_/assets/sky/negY.webp"
import NegZ from "./_/assets/sky/negZ.webp"

export default function Page05() {
    const [asset, setAsset] = React.useState<TgdDataGlb | null>(null)
    const [skybox, setSkybox] = React.useState<{
        imagePosX: HTMLImageElement
        imagePosY: HTMLImageElement
        imagePosZ: HTMLImageElement
        imageNegX: HTMLImageElement
        imageNegY: HTMLImageElement
        imageNegZ: HTMLImageElement
    } | null>(null)
    React.useEffect(() => {
        const all = Promise.all([
            tgdLoadAssets({
                glb: { glb: AssetURL },
                img: {
                    posX: PosX,
                    posY: PosY,
                    posZ: PosZ,
                    negX: NegX,
                    negY: NegY,
                    negZ: NegZ,
                },
            }),
            sleep(1),
        ])
        all.then(([assets]) => {
            setAsset(assets.glb.glb)
            setSkybox({
                imagePosX: assets.img.posX,
                imagePosY: assets.img.posY,
                imagePosZ: assets.img.posZ,
                imageNegX: assets.img.negX,
                imageNegY: assets.img.negY,
                imageNegZ: assets.img.negZ,
            })
        })
    }, [])

    if (!asset || !skybox) return <Spinner />

    return <Game assets={{ glb: asset, skybox }} />
}

function sleep(delay: number) {
    return new Promise((resolve) => globalThis.setTimeout(resolve, delay))
}
