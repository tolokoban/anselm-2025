import React from "react"

import styles from "./WorkInProgress.module.css"
import { useTranslator } from "./translation"

export interface WorkInProgressProps {
    className?: string
}

export default function WorkInProgress({ className }: WorkInProgressProps) {
    const tr = useTranslator()

    return (
        <div className={join(className, styles.workInProgress)}>
            <header>{tr.header()}</header>
            <svg viewBox="0 0 664 580" version="1.0" width="100%" height="100%">
                <defs id="defs5">
                    <linearGradient
                        id="linearGradient3690"
                        y2="476.73"
                        gradientUnits="userSpaceOnUse"
                        x2="424.87"
                        gradientTransform="matrix(1.0203 0 0 1.0203 -6.6069 -7.8855)"
                        y1="9.5332"
                        x1="202.01"
                    >
                        <stop
                            id="stop3681"
                            style={{ stopColor: "white" }}
                            offset="0"
                        />
                        <stop
                            id="stop3683"
                            style={{ stopColor: "white", stopOpacity: 0 }}
                            offset="1"
                        />
                    </linearGradient>
                </defs>
                <g>
                    <path
                        id="path1873"
                        style={{
                            fillRule: "evenodd",
                            stroke: "black",
                            strokeWidth: "1px",
                            fill: "#787878",
                        }}
                        d="m302.31 17.692c14.56-25.218 43.49-25.151 58.46 0.77l299.66 516.76c12.3 21.21 1.4 43.91-30.69 43.91h-598.2c-24.496 0-38.083-25.23-28.415-41.98l299.18-519.46z"
                    />
                    <path
                        id="path2760"
                        style={{
                            fillRule: "evenodd",
                            stroke: "black",
                            strokeWidth: "1px",
                            fill: "red",
                        }}
                        d="m303.5 32.674c17.86-30.93 37.83-31.023 56.17 0.739l287.92 496.51c15.54 26.91 1.35 42.2-29.49 42.2h-574.76c-27.346 0-41.256-16.17-27.303-40.34l287.46-499.11z"
                    />
                    <path
                        id="path2780"
                        style={{
                            fillRule: "evenodd",
                            stroke: "black",
                            strokeWidth: "1px",
                            fill: "#ffeb00",
                        }}
                        d="m116.92 502.31l216.93-376.16 212.3 376.93-429.23-0.77z"
                    />
                    <path
                        id="path2782"
                        style={{
                            fillRule: "evenodd",
                            stroke: "black",
                            strokeWidth: "1px",
                            fill: "#000",
                        }}
                        d="m297.91 266.06c-15.16 0.13-30.34 1.27-33.69 3.56-7.29 4.98-15 46.54-15 46.54s-10.28-9.8-13.84-5.38c-3.47 4.29 11.56 16.53 11.56 16.53l6.53 10.38s-8.87 4.71-10.41 8.84c-1.51 4.08-0.37 69.25-0.37 69.25l-14.22 54.22s-4.06 13.49 10.37 16.53c14.62 3.08 17.32-9.59 17.32-9.59l17.31-65.41-0.78-37.31 31.15 38.09-26.9 55.75s-6.72 12.63 6.9 18.47c13.47 5.77 18.47-6.15 18.47-6.15s33.85-66.25 33.85-71.54c0-5.09-8.47-17.31-8.47-17.31l63.84 51.53s-12.19 2.99-15.75 13.47c-8.56 0.67-15.59 6.89-16.16 15.41-11.05 0.86-20.02 2.59-26.56 15h169.63s-2.13-14.71-21.53-15.41c-1.73-4.78-3.58-7.1-10.38-8.06 1.64-22.44-14.53-21.14-21.16-20.78-15.32-25.21-39.46-18.19-48.84-5l-68.09-55.38s32.81-53.84 33.09-64.62c0.26-9.97-27.41-45.8-34.25-49.22-3.31-1.66-18.46-2.54-33.62-2.41zm-3.66 29.47l-19.56 20.66 4.34-20.13 15.22-0.53zm29.94 46.78l-13.07 24.47-14.68-12.5 27.75-11.97z"
                    />
                    <path
                        fill="#000"
                        transform="translate(330, 150) scale(5, 6) rotate(15)"
                        d="M12,3C16.97,3 21,6.58 21,11C21,15.42 15,21 12,21C9,21 3,15.42 3,11C3,6.58 7.03,3 12,3M10.31,10.93C9.29,9.29 7.47,8.58 6.25,9.34C5.03,10.1 4.87,12.05 5.89,13.69C6.92,15.33 8.74,16.04 9.96,15.28C11.18,14.5 11.33,12.57 10.31,10.93M13.69,10.93C12.67,12.57 12.82,14.5 14.04,15.28C15.26,16.04 17.08,15.33 18.11,13.69C19.13,12.05 18.97,10.1 17.75,9.34C16.53,8.58 14.71,9.29 13.69,10.93Z"
                    />
                    <path
                        id="path3677"
                        style={{
                            fillRule: "evenodd",
                            fill: "url(#linearGradient3690)",
                        }}
                        d="m331.52 1.839c-9.71-0.0824-19.37 7.8468-28.48 23.626l-209.4 363.56c95.71-70.81 227.32-128.08 381.42-164.99l-114.72-197.83c-9.36-16.205-19.11-24.279-28.82-24.361z"
                    />
                </g>
            </svg>
            <footer>{tr.footer()}</footer>
        </div>
    )
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ")
}
