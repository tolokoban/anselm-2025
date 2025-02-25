import React from "react"

import styles from "./LandscapeView.module.css"

export interface LandscapeViewProps {
    className?: string
    onMount(element: HTMLElement): void
    children: React.ReactNode
}

export default function LandscapeView({
    className,
    onMount,
    children,
}: LandscapeViewProps) {
    const refParent = React.useRef<HTMLDivElement | null>(null)
    const refChild = React.useRef<HTMLDivElement | null>(null)
    useResizeObserver(refParent, refChild)
    React.useEffect(() => {
        const parent = refParent.current
        if (parent) onMount(parent)
    }, [refParent.current])

    return (
        <div className={join(className, styles.parent)} ref={refParent}>
            <div className={styles.child} ref={refChild}>
                {children}
            </div>
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}

function useResizeObserver(
    refParent: { current: HTMLDivElement | null },
    refChild: { current: HTMLDivElement | null }
) {
    const refObserver = React.useRef<ResizeObserver | null>(null)
    if (!refObserver.current) {
        refObserver.current = new ResizeObserver((entries) => {
            const parent = refParent.current
            const child = refChild.current
            if (!parent || !child) return

            for (const entry of entries) {
                const container = entry.target
                const { width, height } = container.getBoundingClientRect()
                if (height > width) {
                    // Portrait
                    console.log("PORTRAIT")
                    parent.style.width = `${height}px`
                    parent.style.height = `${width}px`
                    parent.style.transform = `translateX(${width}px) rotate(90deg)`
                } else {
                    // Landscape
                    console.log("LANDSCAPE")
                    parent.style.width = `${width}px`
                    parent.style.height = `${height}px`
                    parent.style.transform = `none`
                }
                console.log(
                    "🚀 [LandscapeView] width, height = ",
                    width,
                    height,
                    [...parent.classList]
                ) // @FIXME: Remove this line written on 2025-02-25 at 11:24
            }
        })
    }
    React.useEffect(() => {
        const div = refParent.current
        if (!div) return

        const observer = refObserver.current
        if (!observer) return

        const container = div.parentElement
        if (!container) return

        observer.observe(container)
        return () => observer.unobserve(container)
    }, [refParent.current])
}
