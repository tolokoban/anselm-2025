import React from "react"
import Style from "./Spinner.module.css"

export default function Spinner() {
    return (
        <svg
            className={Style.Spinner}
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            width="100%"
            version="1.1"
            viewBox="-100 -100 200 200"
            preserveAspectRatio="xMidYMid"
        >
            <g strokeLinecap="round" strokeLinejoin="round">
                <use href="#anim" stroke="#000" strokeWidth="12" />
                <use href="#anim" stroke="#f90" strokeWidth="6" />
                <g stroke="#000" strokeWidth="2">
                    <path
                        d="M-35,-25 h10v-10h-10v-10h10v10h10v10h30v-10h10v-10h10v10h-10v10h10v10h10v10h10v30h-10v-20h-10v20h-10v10h-20v-10h20v-10h-50v10h20v10h-20v-10h-10v-20h-10v20h-10v-30h10v-10h10z"
                        fill="#05d"
                    />
                    <path d="M-25-15h10v10h-10zM15-15h10v10h-10z" fill="#f90" />
                </g>
            </g>
        </svg>
    )
}
