import Sharp from "sharp"

export async function pack(inputImages: Sharp.Sharp[]): Promise<{
    size: [width: number, height: number]
    frames: { image: Sharp.Sharp; x: number; y: number; w: number; h: number }[]
}> {
    if (inputImages.length === 0) return { size: [0, 0], frames: [] }

    const sizes: [width: number, height: number][] = []
    for (const img of inputImages) {
        const { width, height } = await img.metadata()
        sizes.push([width, height])
    }
    let bestAspectRatio = Number.MAX_SAFE_INTEGER
    let bestCandidate: {
        size: [width: number, height: number]
        frames: Array<{
            image: Sharp.Sharp
            x: number
            y: number
            w: number
            h: number
        }>
    } | null = null
    for (let columns = 1; columns <= inputImages.length; columns++) {
        const candidate = packWithColumns(sizes, inputImages, columns)
        const [w, h] = candidate.size
        const W = Math.max(w, h)
        const H = Math.min(w, h)
        const aspectRatio = W / H
        if (aspectRatio < bestAspectRatio) {
            bestAspectRatio = aspectRatio
            bestCandidate = { frames: candidate.frames, size: candidate.size }
        }
    }
    if (!bestCandidate) throw new Error("No candidate!")

    return bestCandidate
}

function packWithColumns(
    sizes: [width: number, height: number][],
    inputImages: Sharp.Sharp[],
    columns: number
): {
    size: [number, number]
    frames: { image: Sharp.Sharp; x: number; y: number; w: number; h: number }[]
} {
    const frames: Array<{
        image: Sharp.Sharp
        x: number
        y: number
        w: number
        h: number
    }> = []
    const rows = Math.ceil(sizes.length / columns)
    let x = 0
    let y = 0
    let ww = 0
    let hh = 0
    let indexSize = 0
    for (let col = 0; col < columns; col++) {
        x = ww
        y = 0
        for (let row = 0; row < rows; row++) {
            if (indexSize >= sizes.length) break

            const [width, height] = sizes[indexSize]
            ww = Math.max(ww, x + width)
            hh = Math.max(hh, y + height)
            frames.push({
                image: inputImages[indexSize],
                x,
                y,
                w: width,
                h: height,
            })
            y += height
            indexSize++
        }
    }
    return {
        size: [ww, hh],
        frames,
    }
}
