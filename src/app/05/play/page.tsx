import { TgdDataGlb, WebglImage, tgdLoadAssets } from "@tolokoban/tgd"
import React from "react"

import Game from "./_/Game"
import Spinner from "./_/Spinner"

import AtlasBallsURL from "@/gfx/05/balls.webp"
import AtlasBricksURL from "@/gfx/05/bricks.webp"
import AtlasPadsURL from "@/gfx/05/pads.webp"

export default function Page05() {
    const [images, setImages] = React.useState<WebglImage[]|undefined>(undefined)
    React.useEffect(() => {
        const all = Promise.all([
            tgdLoadAssets({
                img: {
                    atlasBalls: AtlasBallsURL,
                    atlasBricks: AtlasBricksURL,
                    atlasPads: AtlasPadsURL
                },
            }),
            sleep(1),
        ])
        all.then(([assets]) => {
            const {atlasBalls, atlasBricks, atlasPads}=assets.img
            if(!atlasBalls||!atlasBricks||!atlasPads) {
                console.error("Unable to load atlas:", AtlasBricksURL)
                throw new Error("Unable to load atlas!")
            }
            setImages([atlasBalls, atlasBricks, atlasPads])
        })
    }, [])

    if (!images) return <Spinner />

    const [atlasBalls, atlasBricks, atlasPads]=images
    return <Game assets={{atlasBalls, atlasBricks, atlasPads}} />
}

function sleep(delay: number) {
    return new Promise((resolve) => globalThis.setTimeout(resolve, delay))
}
