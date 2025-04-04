import {
    TgdContext,
    TgdPainterMeshGltf,
    TgdPainterNode,
    TgdParserGLTransfertFormatBinary,
    TgdQuat,
    TgdTransfoOptions,
    TgdVec3,
} from "@tolokoban/tgd"

export class Moon extends TgdPainterNode {
    constructor(context: TgdContext, asset: TgdParserGLTransfertFormatBinary) {
        const nodeName = "Moon"
        const node = asset.getNodeByNameOrThrow(nodeName)
        const meshIndex = node.mesh ?? 0
        const target = new TgdPainterMeshGltf(context, {
            asset,
            meshIndex,
        })
        const transfo: Partial<TgdTransfoOptions> = {}
        if (node.translation) transfo.position = new TgdVec3(node.translation)
        if (node.rotation) transfo.orientation = new TgdQuat(node.rotation)
        if (node.scale) transfo.scale = new TgdVec3(node.scale)
        super({
            children: [target],
            transfo,
        })
    }
}
