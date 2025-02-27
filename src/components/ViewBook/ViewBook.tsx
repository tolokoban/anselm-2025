import React from "react"

import styles from "./ViewBook.module.css"
import ViewText from "../ViewText"
import { pick } from "@/utils/array"
import LandscapeView from "../LandscapeView"

export interface ViewBookProps {
    className?: string
    pages: Array<string | string[]>
    onDone(): void
}

export default function ViewBook({ className, pages, onDone }: ViewBookProps) {
    const [buttonDisabled, setButtonDisabled] = React.useState(true)
    const [pageIndex, setPageIndex] = React.useState(0)
    const page = pick(pages[pageIndex])
    const lastPage = pageIndex >= pages.length - 1
    const handleNextPage = () => {
        const nextPageIndex = pageIndex + 1
        if (nextPageIndex >= pages.length) {
            onDone()
            return
        }
        setButtonDisabled(true)
        setPageIndex(nextPageIndex)
        document.body.requestFullscreen()
    }

    return (
        <LandscapeView>
            <div className={join(className, styles.viewBook)}>
                <ViewText onDone={() => setButtonDisabled(false)}>
                    {page ?? "..."}
                </ViewText>
                <button
                    type="button"
                    disabled={buttonDisabled}
                    onClick={handleNextPage}
                >
                    {lastPage ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <title>controller</title>
                            <path d="M7.97,16L5,19C4.67,19.3 4.23,19.5 3.75,19.5A1.75,1.75 0 0,1 2,17.75V17.5L3,10.12C3.21,7.81 5.14,6 7.5,6H16.5C18.86,6 20.79,7.81 21,10.12L22,17.5V17.75A1.75,1.75 0 0,1 20.25,19.5C19.77,19.5 19.33,19.3 19,19L16.03,16H7.97M7,8V10H5V11H7V13H8V11H10V10H8V8H7M16.5,8A0.75,0.75 0 0,0 15.75,8.75A0.75,0.75 0 0,0 16.5,9.5A0.75,0.75 0 0,0 17.25,8.75A0.75,0.75 0 0,0 16.5,8M14.75,9.75A0.75,0.75 0 0,0 14,10.5A0.75,0.75 0 0,0 14.75,11.25A0.75,0.75 0 0,0 15.5,10.5A0.75,0.75 0 0,0 14.75,9.75M18.25,9.75A0.75,0.75 0 0,0 17.5,10.5A0.75,0.75 0 0,0 18.25,11.25A0.75,0.75 0 0,0 19,10.5A0.75,0.75 0 0,0 18.25,9.75M16.5,11.5A0.75,0.75 0 0,0 15.75,12.25A0.75,0.75 0 0,0 16.5,13A0.75,0.75 0 0,0 17.25,12.25A0.75,0.75 0 0,0 16.5,11.5Z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <title>dots-horizontal</title>
                            <path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" />
                        </svg>
                    )}
                </button>
            </div>
        </LandscapeView>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
