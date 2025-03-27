import React from "react"

import Tgd from "@/components/Tgd"
import { useGame } from "./_/game"

import imagePosX from "./_/posX.webp" // +X
import imagePosY from "./_/posY.webp" // +Y
import imagePosZ from "./_/posZ.webp" // +Z
import imageNegX from "./_/negX.webp" // -X
import imageNegY from "./_/negY.webp" // -Y
import imageNegZ from "./_/negZ.webp" // -Z

import Styles from "./page.module.css"

export default function PagePlay() {
    const game = useGame()

    return (
        <div className={Styles.play}>
            <Tgd
                onReady={game.init}
                assets={{
                    image: {
                        imagePosX,
                        imagePosY,
                        imagePosZ,
                        imageNegX,
                        imageNegY,
                        imageNegZ,
                    },
                }}
            />
        </div>
    )
}
