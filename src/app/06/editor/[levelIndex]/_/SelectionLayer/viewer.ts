import { tgdCalcClamp } from "@tolokoban/tgd";
import React from "react";
import type { ArkanoidLevel } from "@/game/05/levels/types";
import type { AreaSelection } from "./types";
import { type LevelUpdater, useLevelUpdater } from "./updater";

const COLS = 26;
const ROWS = 26;

export class SelectionViewer {
	public onSelectionChange?: (selection: AreaSelection) => void;
	private _canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private cursorCol = -1;
	private cursorRow = -1;
	private raf = -1;
	private _selection: AreaSelection = {
		col1: 12,
		row1: 12,
		col2: 12,
		row2: 12,
	};
	private pointerDown = false;
	private col0 = 0;
	private row0 = 0;

	constructor(private readonly updater: LevelUpdater) {}

	get selection() {
		return this._selection;
	}
	private set selection(selection: AreaSelection) {
		const col1 = tgdCalcClamp(
			Math.min(selection.col1, selection.col2),
			0,
			COLS - 1,
		);
		const col2 = tgdCalcClamp(
			Math.max(selection.col1, selection.col2),
			0,
			COLS - 1,
		);
		const row1 = tgdCalcClamp(
			Math.min(selection.row1, selection.row2),
			0,
			ROWS - 1,
		);
		const row2 = tgdCalcClamp(
			Math.max(selection.row1, selection.row2),
			0,
			ROWS - 1,
		);
		if (
			col1 === this.selection.col1 &&
			col2 === this.selection.col2 &&
			row1 === this.selection.row1 &&
			row2 === this.selection.row2
		) {
			return;
		}

		this._selection = { col1, col2, row1, row2 };
		this.paint();
	}

	update(value: Partial<ArkanoidLevel>) {
		this.updater.update(value);
	}

	readonly undo = () => this.updater.undo();

	readonly init = (canvas: HTMLCanvasElement | null) => {
		this.detach();
		this._canvas = canvas;
		if (!canvas) return;

		this._canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.paint();
		this.attach();
		return this.detach;
	};

	readonly growSelection = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1 - 2,
			col2: col2 + 2,
			row1: row1 - 1,
			row2: row2 + 1,
		};
	};

	readonly growUp = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1,
			col2: col2,
			row1: row1 - 1,
			row2: row2,
		};
	};

	readonly growDown = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1,
			col2: col2,
			row1: row1,
			row2: row2 + 1,
		};
	};

	readonly growRight = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1,
			col2: col2 + 2,
			row1: row1,
			row2: row2,
		};
	};

	readonly growLeft = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1 - 2,
			col2: col2,
			row1: row1,
			row2: row2,
		};
	};

	readonly shrinkUp = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1,
			col2: col2,
			row1: row1,
			row2: row2 - 1,
		};
	};

	readonly shrinkDown = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1,
			col2: col2,
			row1: row1 + 1,
			row2: row2,
		};
	};

	readonly shrinkRight = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1 + 2,
			col2: col2,
			row1: row1,
			row2: row2,
		};
	};

	readonly shrinkLeft = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1,
			col2: col2 - 2,
			row1: row1,
			row2: row2,
		};
	};

	readonly shrinkSelection = () => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1 + 2,
			col2: col2 - 2,
			row1: row1 + 1,
			row2: row2 - 1,
		};
	};

	readonly moveSelection = (col: number, row: number) => {
		const { col1, col2, row1, row2 } = this.selection;
		this.selection = {
			col1: col1 + col,
			col2: col2 + col,
			row1: row1 + row,
			row2: row2 + row,
		};
	};

	readonly clearRegion = () => {
		this.updater.clear(this.selection);
	};

	readonly fillRegion = (type: "[" | "(" | "{" | "<") => {
		this.updater.fill(this.selection, type);
	};

	readonly setBonus = (type: number) => {
		this.updater.fillBonus(this.selection, type);
	};

	readonly moveRight = () => this.moveSelection(+1, 0);
	readonly moveLeft = () => this.moveSelection(-1, 0);
	readonly moveUp = () => this.moveSelection(0, -1);
	readonly moveDown = () => this.moveSelection(0, +1);

	get hueShift() {
		return this.updater.level.hueShift ?? 0;
	}
	set hueShift(hueShift: number) {
		this.updater.update({ hueShift });
	}

	get hueRandom() {
		return this.updater.level.hueRandom ?? 0;
	}
	set hueRandom(hueRandom: number) {
		this.updater.update({ hueRandom });
	}

	get backgroundIndex() {
		return this.updater.level.backgroundIndex;
	}
	set backgroundIndex(backgroundIndex: number) {
		this.updater.update({ backgroundIndex });
	}

	private readonly attach = () => {
		const canvas = this._canvas;
		if (!canvas) return;

		canvas.addEventListener("pointermove", this.handlePointerMove);
		canvas.addEventListener("pointerdown", this.handlePointerDown);
		canvas.addEventListener("pointerup", this.handlePointerUp);
		canvas.addEventListener("pointercancel", this.handlePointerCancel);
	};

	private readonly detach = () => {
		const canvas = this._canvas;
		if (!canvas) return;

		canvas.removeEventListener("pointermove", this.handlePointerMove);
		canvas.removeEventListener("pointerdown", this.handlePointerDown);
		canvas.removeEventListener("pointerup", this.handlePointerUp);
		canvas.removeEventListener("pointercancel", this.handlePointerCancel);
		this._canvas = null;
	};

	private readonly handlePointerMove = (evt: PointerEvent) => {
		const canvas = this._canvas;
		if (!canvas) return;

		const { x2col, y2row } = getCoords(canvas);
		const col = x2col(evt.clientX);
		const row = y2row(evt.clientY);
		if (this.pointerDown) {
			const { col0, row0 } = this;
			let col2 = col;
			if (Math.abs(col2 - col0) % 2 !== 0) {
				col2 += col2 > col0 ? +1 : -1;
			}
			this.selection = {
				col1: col0,
				row1: row0,
				col2,
				row2: row,
			};
			return;
		}
		if (col === this.cursorCol && row === this.cursorRow) return;

		this.cursorCol = col;
		this.cursorRow = row;
		this.paint();
	};

	private readonly handlePointerDown = (evt: PointerEvent) => {
		const canvas = this._canvas;
		if (!canvas) return;

		console.log("DOWN");
		this.pointerDown = true;
		const col = this.cursorCol;
		const row = this.cursorRow;
		this.selection = {
			col1: col,
			row1: row,
			col2: col,
			row2: row,
		};
		this.col0 = col;
		this.row0 = row;
		this.paint();
	};

	private readonly handlePointerUp = (evt: PointerEvent) => {
		this.pointerDown = false;
	};

	private readonly handlePointerCancel = (evt: PointerEvent) => {
		this.pointerDown = false;
	};

	private readonly paint = () => {
		globalThis.cancelAnimationFrame(this.raf);
		this.raf = globalThis.requestAnimationFrame(this.actualPaint);
	};

	private readonly actualPaint = () => {
		const ctx = this.ctx;
		const canvas = this._canvas;
		if (!canvas || !ctx) return;

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		const { col2x, row2y } = getCoords(canvas);
		ctx.clearRect(0, 0, col2x(COLS + 1), row2y(ROWS + 1));
		const { col1, col2, row1, row2 } = this.selection;
		console.debug(JSON.stringify(this.selection));
		ctx.fillStyle = "rgba(255,255,255,0.1)";
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.rect(
			col2x(col1),
			row2y(row1),
			col2x(2 + col2 - col1),
			row2y(1 + row2 - row1),
		);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		const col = this.cursorCol;
		const row = this.cursorRow;
		ctx.fillStyle = "rgba(0,200,255,0.1)";
		ctx.strokeStyle = "rgb(0,200,255)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect(col2x(col), row2y(row), col2x(2), row2y(1));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	};
}

export function useSelectionViewer(levelIndex: number) {
	const { updater, level } = useLevelUpdater(levelIndex);
	const ref = React.useRef<SelectionViewer | null>(null);
	if (!ref.current) ref.current = new SelectionViewer(updater);
	return ref.current;
}

function getCoords(canvas: HTMLCanvasElement) {
	const { width, height } = canvas;
	return {
		x2col: (x: number) => Math.floor((COLS * x) / width),
		y2row: (y: number) => Math.floor((ROWS * y) / height),
		col2x: (col: number) => 0.5 + Math.round((width * Math.floor(col)) / COLS),
		row2y: (row: number) => 0.5 + Math.round((height * Math.floor(row)) / ROWS),
	};
}
