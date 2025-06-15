import React from "react"

import LandscapeView from "@/components/LandscapeView"

export default function LayoutBackground({
    children,
}: {
    children: React.ReactNode
}) {
    return <LandscapeView>{children}</LandscapeView>
}
