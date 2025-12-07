import React from "react"
import { TgdDataGlb, tgdLoadGlb } from "@tolokoban/tgd"

import Spinner from "./_/Spinner"
import Game from "./_/Game"

import AssetURL from "./_/assets/asset.glb"

export default function Page05() {
    const [asset, setAsset] = React.useState<TgdDataGlb | null>(null)
    React.useEffect(() => {
        tgdLoadGlb(AssetURL).then(setAsset)
    }, [])

    if (!asset) return <Spinner />

    return <Game assets={{ glb: asset }} />
}
