import React from "react"

export function useAssetsImages<T extends string>(
    urls: Record<T, string>
): Record<T, HTMLImageElement> | undefined | null {
    const [images, setImages] = React.useState<
        Record<T, HTMLImageElement> | undefined | null
    >(undefined)

    // biome-ignore lint/correctness/useExhaustiveDependencies: only the URLs are important for refresh.
    React.useEffect(() => {
        setImages(undefined)
        const entries = Object.entries(urls) as [T, string][]
        let isCancelled = false
        Promise.all(
            entries.map(async ([key, url]) => {
                const image = new Image()
                image.src = url
                await new Promise((resolve, reject) => {
                    image.onload = resolve
                    image.onerror = reject
                })
                return [key, image] as [T, HTMLImageElement]
            })
        )
            .then((entries) => {
                if (isCancelled) return
                setImages(
                    Object.fromEntries(entries) as Record<T, HTMLImageElement>
                )
            })
            .catch(() => setImages(null))
        return () => {
            isCancelled = true
        }
    }, [JSON.stringify(urls)])

    return images
}
