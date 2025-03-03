import React from "react"

import Background from "@/generated/background-02"
import LandscapeView from "@/components/LandscapeView"

import Styles from "./layout.module.css"

export default function LayoutBackground({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LandscapeView>
            <div className={Styles.Layoutbackground}>
                <Background type="background" />
                {children}
            </div>
        </LandscapeView>
    )
}
