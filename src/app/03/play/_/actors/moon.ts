import {
    TgdContext,
    TgdPainterMeshGltf,
    TgdPainterNode,
    TgdDataGlb,
    TgdQuat,
    TgdTransfoOptions,
    TgdVec3,
} from "@tolokoban/tgd"

export class Moon extends TgdPainterNode {
    constructor(context: TgdContext, asset: TgdDataGlb) {
        const nodeName = "Moon"
        const node = asset.getNodeByNameOrThrow(nodeName)
        const meshIndexOrName = node.mesh ?? 0
        const target = new TgdPainterMeshGltf(context, {
            asset,
            meshIndexOrName,
        })
        const transfo: Partial<TgdTransfoOptions> = {}
        if (node.translation) transfo.position = new TgdVec3(node.translation)
        if (node.rotation) transfo.orientation = new TgdQuat(node.rotation)
        if (node.scale) transfo.scale = new TgdVec3(node.scale)
        super({
            children: [target],
            transfo,
            name: "Moon",
        })
    }
}
