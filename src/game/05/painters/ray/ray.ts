import {
	type TgdContext,
	TgdDataset,
	TgdPainter,
	TgdPainterState,
	TgdProgram,
	TgdShaderFragment,
	TgdShaderVertex,
	TgdVertexArray,
	tgdCodeFunction_perlinNoise,
	webglPresetBlend,
	webglPresetDepth,
} from "@tolokoban/tgd";

export class PainterRay extends TgdPainter {
	public x = 0;
	public y = 0;
	public vx = 1;
	public vy = 1;

	private readonly prg: TgdProgram;
	private readonly vao: TgdVertexArray;

	constructor(private readonly context: TgdContext) {
		super();
		const ang = 0.017453292519943295; // 1 degree expressed in radians
		const radius = 26;
		const x = radius * Math.sin(ang);
		const y = radius * Math.cos(ang);
		const position = [0, 0, x, y, -x, y];
		const light = [1, 0, 0];
		const dataset = new TgdDataset({
			attPos: "vec2",
			attLight: "float",
		});
		dataset.set("attPos", new Float32Array(position));
		dataset.set("attLight", new Float32Array(light));
		const prg = new TgdProgram(context.gl, {
			vert: new TgdShaderVertex({
				uniforms: {
					uniX: "float",
					uniY: "float",
					uniVX: "float",
					uniVY: "float",
					uniModelViewMatrix: "mat4",
					uniProjectionMatrix: "mat4",
				},
				attributes: {
					attPos: "vec2",
					attLight: "float",
				},
				varying: {
					varColor: "vec3",
					varPos: "vec2",
				},
				mainCode: [
					"varPos = attPos;",
					"varColor = attLight * vec3(1.0, .667, .1);",
					"mat2 mat = mat2(uniVY, -uniVX, uniVX, uniVY);",
					"vec4 pos = vec4(mat * attPos + vec2(uniX, uniY), 0.0, 1.0);",
					"gl_Position = uniProjectionMatrix * uniModelViewMatrix * pos;",
				],
			}).code,
			frag: new TgdShaderFragment({
				uniforms: {
					uniTime: "float",
				},
				varying: {
					varColor: "vec3",
					varPos: "vec2",
				},
				outputs: {
					FragColor: "vec4",
				},
				functions: {
					...tgdCodeFunction_perlinNoise(),
				},
				mainCode: [
					"float factor = perlinNoise(vec3(vec2(10.0, 0.5) * varPos + vec2(0.0, -10.0 * uniTime), uniTime));",
					"factor = factor * .5 + .5;",
					"FragColor = vec4(varColor * factor, 1.0);",
				],
			}).code,
		});
		const vao = new TgdVertexArray(context.gl, prg, [dataset]);
		prg.debug();
		vao.debug();
		this.prg = prg;
		this.vao = vao;
	}

	delete(): void {
		this.prg.delete();
		this.vao.delete();
	}

	paint(time: number, delay: number): void {
		const { x, y, vx, vy, prg, vao, context } = this;
		const invLength = 1 / Math.sqrt(vx * vx + vy * vy);
		prg.use();
		prg.uniform1f("uniX", x);
		prg.uniform1f("uniY", y);
		prg.uniform1f("uniVX", vx * invLength);
		prg.uniform1f("uniVY", vy * invLength);
		prg.uniform1f("uniTime", time);
		const { camera } = context;
		prg.uniformMatrix4fv("uniModelViewMatrix", camera.matrixModelView);
		prg.uniformMatrix4fv("uniProjectionMatrix", camera.matrixProjection);
		vao.bind();
		TgdPainterState.do(context, {
			depth: webglPresetDepth.off,
			blend: webglPresetBlend.add,
			action: () => context.gl.drawArrays(context.gl.TRIANGLE_STRIP, 0, 3),
		});
		vao.unbind();
	}
}
