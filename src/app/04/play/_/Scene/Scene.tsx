import React from "react"

import styles from "./Scene.module.css"

export interface SceneProps {
    className?: string
    img1: HTMLImageElement | null
    img2: HTMLImageElement | null
}

const ANIMATION: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }]

export default function Scene({ className, img1, img2 }: SceneProps) {
    const refDiv = React.useRef<HTMLDivElement | null>(null)
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        setLoaded(!!img2)
    }, [img2])
    React.useEffect(() => {
        const div = refDiv.current
        if (!div || !img1) return

        div.animate(ANIMATION, { duration: 400 })
    }, [img1])

    return (
        <div className={join(className, styles.scene)}>
            <div
                style={{
                    backgroundImage: `url(${img2?.currentSrc})`,
                    opacity: loaded ? 1 : 0,
                }}
            />
            <div
                ref={refDiv}
                style={{
                    backgroundImage: `url(${img1?.currentSrc})`,
                    opacity: loaded ? 1 : 0,
                }}
            />
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
