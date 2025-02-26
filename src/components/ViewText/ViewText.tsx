import React from "react"

import styles from "./ViewText.module.css"

export interface ViewTextProps {
    className?: string
    children: string
    onDone(): void
}

export default function ViewText({
    className,
    children,
    onDone,
}: ViewTextProps) {
    const refLength = React.useRef(0)
    const refInterval = React.useRef(0)
    const [letters, setLetters] = React.useState<string[]>([])
    const [length, setLength] = React.useState(0)
    React.useEffect(() => {
        refLength.current = 0
        setLength(0)
        setLetters([])
        window.setTimeout(() => {
            setLetters(children.split(""))
        }, 300)
        window.clearTimeout(refInterval.current)
        refInterval.current = window.setInterval(() => {
            refLength.current++
            if (refLength.current > children.length) {
                window.clearTimeout(refInterval.current)
                refInterval.current = 0
                onDone()
                return
            }
            setLength(refLength.current)
        }, 40)
        return () => window.clearTimeout(refInterval.current)
    }, [children])
    const handleRevealAll = () => {
        refLength.current = children.length
        setLength(refLength.current)
        onDone()
    }

    return (
        <div className={join(className, styles.viewText)}>
            <div onClick={handleRevealAll}>
                {letters.map((letter, index) => (
                    <span
                        key={`${letter}$#${index}/${children.length}`}
                        className={join(index < length && styles.show)}
                    >
                        {letter}
                    </span>
                ))}
            </div>
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
