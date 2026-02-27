import type {
	TgdContext,
	TgdInputGamepad,
	TgdInputPointerEventMove,
} from "@tolokoban/tgd";

export class Inputs {
	public readonly gamepad: TgdInputGamepad;

	private click = false;

	private readonly pressedButtons = new Set<string>();

	constructor(private readonly context: TgdContext) {
		const buttons = ["left", "right"];
		buttons.forEach(this.registerButton);
		this.gamepad = context.inputs.gamepad;
		context.inputs.pointer.eventTap.addListener(() => {
			this.click = true;
		});
	}

	update(time: number, delay: number) {
		// this._isTouching = this.context.inputs.pointer.isTouching();
	}

	get isTouching() {
		return true;
		//this._isTouching;
	}

	get pointerX() {
		return this.context.inputs.pointer.x;
		// return this._pointerX;
	}

	get right() {
		return (
			this.context.inputs.keyboard.isDown("ArrowRight") ||
			this.pressedButtons.has("right")
		);
	}

	get left() {
		return (
			this.context.inputs.keyboard.isDown("ArrowLeft") ||
			this.pressedButtons.has("left")
		);
	}

	get fire() {
		if (this.click) {
			this.click = false;
			return true;
		}
		return (
			this.context.inputs.keyboard.isDown(" ") ||
			this.pressedButtons.has("fire")
		);
	}

	private readonly registerButton = (id: string) => {
		const button = globalThis.document.getElementById(`btn-${id}`);
		if (!button) throw new Error(`No button with id #btn-${id}!`);

		button.addEventListener("pointerdown", () => this.pressedButtons.add(id));
		button.addEventListener("pointerup", () => this.pressedButtons.delete(id));
		button.addEventListener("pointercancel", () =>
			this.pressedButtons.delete(id),
		);
	};
}
