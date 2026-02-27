import React from "react"

import styles from "./ViewText.module.css"

export interface ViewTextProps {
    className?: string
    children: string
    onDone?(): void
}

export default function ViewText({
    className,
    children,
    onDone,
}: ViewTextProps) {
    const refLength = React.useRef(0)
    const refInterval = React.useRef(0)
    const [letters, setLetters] = React.useState<
        [letter: string, index: number][][][]
    >([])
    const [length, setLength] = React.useState(0)
    React.useEffect(() => {
        refLength.current = 0
        setLength(0)
        setLetters([])
        window.setTimeout(() => {
            setLetters(splitLetters(children))
        })
        window.clearTimeout(refInterval.current)
        refInterval.current = window.setInterval(() => {
            refLength.current++
            if (refLength.current > children.length) {
                window.clearTimeout(refInterval.current)
                refInterval.current = 0
                onDone?.()
                return
            }
            setLength(refLength.current)
        }, 5)
        return () => window.clearTimeout(refInterval.current)
    }, [children])
    const handleRevealAll = () => {
        refLength.current = children.length
        setLength(refLength.current)
        onDone?.()
    }

    return (
        <div className={join(className, styles.viewText)}>
            <div onClick={handleRevealAll}>
                {letters.map(
                    (line, index) => (
                        <p key={index}>
                            {line.map((word, idxWord) => (
                                <div key={idxWord}>
                                    {word.map(([letter, idxLetter]) => (
                                        <span
                                            key={`${letter}$#${idxLetter}/${children.length}`}
                                            className={join(
                                                idxLetter < length &&
                                                    styles.show
                                            )}
                                        >
                                            {letter}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </p>
                    )
                    // letter === "\n" ? (
                    //     <br />
                    // ) : (
                    //     <span
                    //         key={`${letter}$#${index}/${children.length}`}
                    //         className={join(index < length && styles.show)}
                    //     >
                    //         {letter}
                    //     </span>
                    // )
                )}
            </div>
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}

function splitLetters(text: string): [letter: string, index: number][][][] {
    let letterIndex = 0
    return text.split("\n").map((line) =>
        line
            .trim()
            .split(" ")
            .map((word) =>
                word.split("").map((letter) => [letter, letterIndex++])
            )
    )
}
