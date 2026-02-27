import AtomicState from "@tolokoban/react-state";
import { type ArkanoidLevel, isArkanoidLevelArray } from "./types";

/**
 * All levels: https://strategywiki.org/wiki/Arkanoid:_Revenge_of_Doh/Walkthrough
 */

export const ArkanoidLevels: ArkanoidLevel[] = [
	{
		hueShift: 60,
		hueRandom: 30,
		pose: [
			"                          ",
			"        <><><><><>        ",
			"       [][][][][][]       ",
			"      (F(T(F()(F(T(F      ",
			"     [][][][][][][][]     ",
			"    (G(T(G(T(G(T(G(T(G    ",
			"     [][][][][][][][]     ",
			"      (G(T(G(T(G(T(G      ",
			"       [][][][][][]       ",
			"        (F(T(G(T(F        ",
		],
		backgroundIndex: 0,
		options: {
			T: {
				bonus: 1,
			},
			G: {
				bonus: 2,
			},
			F: {
				bonus: 3,
			},
			L: {
				bonus: 4,
			},
			S: {
				bonus: 5,
			},
			U: {
				bonus: 6,
			},
			Z: {
				bonus: 7,
			},
			"@": {
				bonus: 8,
			},
			a: {
				hueShift: 0,
			},
			b: {
				hueShift: 0.4188790204786391,
			},
			c: {
				hueShift: 0.8377580409572782,
			},
			d: {
				hueShift: 1.2566370614359172,
			},
			e: {
				hueShift: 1.6755160819145565,
			},
			f: {
				hueShift: 2.0943951023931953,
			},
			g: {
				hueShift: 2.5132741228718345,
			},
			h: {
				hueShift: 2.9321531433504737,
			},
			i: {
				hueShift: 3.351032163829113,
			},
			j: {
				hueShift: 3.7699111843077517,
			},
			k: {
				hueShift: 4.1887902047863905,
			},
			l: {
				hueShift: 4.60766922526503,
			},
			m: {
				hueShift: 5.026548245743669,
			},
			n: {
				hueShift: 5.445427266222308,
			},
			o: {
				hueShift: 5.8643062867009474,
			},
		},
	},
	{
		hueShift: 180,
		pose: [
			"<><Z<><><Z<><Z<><Z<><><Z<>",
			"<>()()()()()()()()()()()<>",
			"<>()[d[d[d[d[d[d[d[d[d()<>",
			"<>()[d()()()(Z()()()[d()<>",
			"<>()[d()()()(Z()()()[d()<>",
			"<>()[d[d[d[d[d[d[d[d[d()<>",
			"<>()()()()()()()()()()()<>",
			"<><Z<><Z<><><Z<><><Z<><Z<>",
			"<>()()()()()()()()()()()<>",
			"<>()[i[i[i[i[i[i[i[i[i()<>",
			"<>()[i()()()(Z()()()[i()<>",
			"<>()[i()()()(Z()()()[i()<>",
			"<>()[i[i[i[i[i[i[i[i[i()<>",
			"<>()()()()()()()()()()()<>",
			"<><Z<><><Z<><Z<><Z<><><Z<>",
		],
		backgroundIndex: 2,
		backgroundRepeats: 5,
		options: {
			T: {
				bonus: 1,
			},
			G: {
				bonus: 2,
			},
			F: {
				bonus: 3,
			},
			L: {
				bonus: 4,
			},
			S: {
				bonus: 5,
			},
			U: {
				bonus: 6,
			},
			Z: {
				bonus: 7,
			},
			"@": {
				bonus: 8,
			},
			a: {
				hueShift: 0,
			},
			b: {
				hueShift: 0.4188790204786391,
			},
			c: {
				hueShift: 0.8377580409572782,
			},
			d: {
				hueShift: 1.2566370614359172,
			},
			e: {
				hueShift: 1.6755160819145565,
			},
			f: {
				hueShift: 2.0943951023931953,
			},
			g: {
				hueShift: 2.5132741228718345,
			},
			h: {
				hueShift: 2.9321531433504737,
			},
			i: {
				hueShift: 3.351032163829113,
			},
			j: {
				hueShift: 3.7699111843077517,
			},
			k: {
				hueShift: 4.1887902047863905,
			},
			l: {
				hueShift: 4.60766922526503,
			},
			m: {
				hueShift: 5.026548245743669,
			},
			n: {
				hueShift: 5.445427266222308,
			},
			o: {
				hueShift: 5.8643062867009474,
			},
		},
	},
	{
		pose: [
			"      (U          (U      ",
			"      (T          (T      ",
			"        (F      (F        ",
			"        (S      (S        ",
			"      {}[][][][][]{}      ",
			"      [][][][Z[][][]      ",
			"    [][]<><>[]<><>[][]    ",
			"    [][]<><F[]<F<>[][]    ",
			"  [][][][][][][][][][][]  ",
			"  [][S[][][][S[][][][S[]  ",
			"  []  []{}[]{}[]{}[]  []  ",
			"  []  []          []  []  ",
			"  [U  []          []  [U  ",
			"        [][L  [L[]        ",
			"        [][]  [][S        ",
		],
		backgroundIndex: 1,
		backgroundRepeats: 5,
		options: {
			T: {
				bonus: 1,
			},
			G: {
				bonus: 2,
			},
			F: {
				bonus: 3,
			},
			L: {
				bonus: 4,
			},
			S: {
				bonus: 5,
			},
			U: {
				bonus: 6,
			},
			Z: {
				bonus: 7,
			},
			"@": {
				bonus: 8,
			},
			a: {
				hueShift: 0,
			},
			b: {
				hueShift: 0.4188790204786391,
			},
			c: {
				hueShift: 0.8377580409572782,
			},
			d: {
				hueShift: 1.2566370614359172,
			},
			e: {
				hueShift: 1.6755160819145565,
			},
			f: {
				hueShift: 2.0943951023931953,
			},
			g: {
				hueShift: 2.5132741228718345,
			},
			h: {
				hueShift: 2.9321531433504737,
			},
			i: {
				hueShift: 3.351032163829113,
			},
			j: {
				hueShift: 3.7699111843077517,
			},
			k: {
				hueShift: 4.1887902047863905,
			},
			l: {
				hueShift: 4.60766922526503,
			},
			m: {
				hueShift: 5.026548245743669,
			},
			n: {
				hueShift: 5.445427266222308,
			},
			o: {
				hueShift: 5.8643062867009474,
			},
		},
		hueShift: 0,
		hueRandom: 0,
		backgroundHueShift: 0,
	},
	{
		hueShift: 120,
		pose: [
			"      (a         [][]     ",
			"     (b(b        [][]     ",
			"    (c(c(c       [][]     ",
			"   (d(d(d(d      [][]     ",
			"  (e(e(e(e(e     [][]     ",
			" (f  (f(f  (f    [][]     ",
			"     (g(g        [][]     ",
			"     (h(h        [][]     ",
			"     (i(i        [][]     ",
			"     (j(j    []  [][]  [] ",
			"     (k(k     [][][][][]  ",
			"     (l(l      [][][][]   ",
			"     (m(m       [][][]    ",
			"     (n(n        [][]     ",
			"     (o(o         []      ",
		],
		backgroundIndex: 3,
		options: {
			T: {
				bonus: 1,
			},
			G: {
				bonus: 2,
			},
			F: {
				bonus: 3,
			},
			L: {
				bonus: 4,
			},
			S: {
				bonus: 5,
			},
			U: {
				bonus: 6,
			},
			Z: {
				bonus: 7,
			},
			"@": {
				bonus: 8,
			},
			a: {
				hueShift: 0,
			},
			b: {
				hueShift: 0.4188790204786391,
			},
			c: {
				hueShift: 0.8377580409572782,
			},
			d: {
				hueShift: 1.2566370614359172,
			},
			e: {
				hueShift: 1.6755160819145565,
			},
			f: {
				hueShift: 2.0943951023931953,
			},
			g: {
				hueShift: 2.5132741228718345,
			},
			h: {
				hueShift: 2.9321531433504737,
			},
			i: {
				hueShift: 3.351032163829113,
			},
			j: {
				hueShift: 3.7699111843077517,
			},
			k: {
				hueShift: 4.1887902047863905,
			},
			l: {
				hueShift: 4.60766922526503,
			},
			m: {
				hueShift: 5.026548245743669,
			},
			n: {
				hueShift: 5.445427266222308,
			},
			o: {
				hueShift: 5.8643062867009474,
			},
			"]": {
				bonus: 6,
			},
		},
	},
	{
		hueShift: 40,
		hueRandom: 10,
		pose: [
			"         {}{}{}{}         ",
			"        {}[][][]{}        ",
			"      {}[][][][][]{}      ",
			"      {}[][][][][]{}      ",
			"    {}[][][]<F<F[][]{}    ",
			"    {}[][][]<F<F[][]{}    ",
			"   {}[][][][][][][][T{}   ",
			"   {}[][][][][][][]       ",
			"  {}[][][][][][]          ",
			"  {}[][][][T              ",
			"  {}[][][][][][]          ",
			"   {}[][][][][][][]       ",
			"   {}[][][][][][][][T{}   ",
			"    {}[][][][][][][]{}    ",
			"    {}[][][][][][][]{}    ",
			"      {}[][][][][]{}      ",
			"      {}[][][][][]{}      ",
			"        {}[][][]{}        ",
			"         {}{}{}{}         ",
		],
		backgroundIndex: 4,
		backgroundRepeats: 2,
		backgroundHueShift: 180,
		options: {
			T: {
				bonus: 1,
			},
			G: {
				bonus: 2,
			},
			F: {
				bonus: 3,
			},
			L: {
				bonus: 4,
			},
			S: {
				bonus: 5,
			},
			U: {
				bonus: 6,
			},
			Z: {
				bonus: 7,
			},
			"@": {
				bonus: 8,
			},
			a: {
				hueShift: 0,
			},
			b: {
				hueShift: 0.4188790204786391,
			},
			c: {
				hueShift: 0.8377580409572782,
			},
			d: {
				hueShift: 1.2566370614359172,
			},
			e: {
				hueShift: 1.6755160819145565,
			},
			f: {
				hueShift: 2.0943951023931953,
			},
			g: {
				hueShift: 2.5132741228718345,
			},
			h: {
				hueShift: 2.9321531433504737,
			},
			i: {
				hueShift: 3.351032163829113,
			},
			j: {
				hueShift: 3.7699111843077517,
			},
			k: {
				hueShift: 4.1887902047863905,
			},
			l: {
				hueShift: 4.60766922526503,
			},
			m: {
				hueShift: 5.026548245743669,
			},
			n: {
				hueShift: 5.445427266222308,
			},
			o: {
				hueShift: 5.8643062867009474,
			},
		},
	},
	{
		hueShift: 107,
		hueRandom: 67,
		pose: [
			"                          ",
			"                          ",
			"  < < < < <   (A(         ",
			"         <H    < <(       ",
			"       <H       <D( ( (B  ",
			"     <H         <D( ( (B  ",
			"   <H          < <(       ",
			"  < < < < <   (A(         ",
			"                    { { { ",
			"                          ",
			"    [A[A[A[A   [G [G[G    ",
			"  [ [ [ [ [   [   [  [    ",
			"  [   [B      [   [D  [   ",
			"  [   [B      [   [D  [   ",
			"  [ [ [ [ [    [  [   [   ",
			"    [A[A[A[A    [F[F [F   ",
			"                          ",
			"                          ",
			"         { { { {          ",
		],
		backgroundIndex: 4,
		backgroundRepeats: 2,
		backgroundHueShift: 180,
		options: {
			T: {
				bonus: 1,
			},
			G: {
				bonus: 6,
			},
			F: {
				bonus: 5,
			},
			L: {
				bonus: 4,
			},
			S: {
				bonus: 5,
			},
			U: {
				bonus: 6,
			},
			Z: {
				bonus: 7,
			},
			"@": {
				bonus: 8,
			},
			a: {
				hueShift: 0,
			},
			b: {
				hueShift: 0.4188790204786391,
			},
			c: {
				hueShift: 0.8377580409572782,
			},
			d: {
				hueShift: 1.2566370614359172,
			},
			e: {
				hueShift: 1.6755160819145565,
			},
			f: {
				hueShift: 2.0943951023931953,
			},
			g: {
				hueShift: 2.5132741228718345,
			},
			h: {
				hueShift: 2.9321531433504737,
			},
			i: {
				hueShift: 3.351032163829113,
			},
			j: {
				hueShift: 3.7699111843077517,
			},
			k: {
				hueShift: 4.1887902047863905,
			},
			l: {
				hueShift: 4.60766922526503,
			},
			m: {
				hueShift: 5.026548245743669,
			},
			n: {
				hueShift: 5.445427266222308,
			},
			o: {
				hueShift: 5.8643062867009474,
			},
			H: {
				bonus: 7,
			},
			A: {
				bonus: 0,
			},
			B: {
				bonus: 1,
			},
			C: {
				bonus: 2,
			},
			D: {
				bonus: 3,
			},
			E: {
				bonus: 4,
			},
		},
	},
]; // .slice(0, 1) as ArkanoidLevel[];

export const StateArkanoid = {
	levels: new AtomicState(ArkanoidLevels, {
		storage: {
			id: "05/levels.1",
			guard: isArkanoidLevelArray,
		},
	}),
	lifes: new AtomicState(3),
};

export function useArkanoidLevels() {
	const [levels, setLevels] = StateArkanoid.levels.useState();
	return {
		levels,
		updateLevel(levelIndex: number, level: ArkanoidLevel) {
			const array = levels.slice();
			array[levelIndex] = level;
			setLevels(array);
		},
		deleteLevel(levelIndex: number) {
			const array = levels.slice();
			array.splice(levelIndex, 1);
			setLevels(array);
		},
		addLevel(level: ArkanoidLevel) {
			setLevels([...levels, level]);
		},
		swapLevels(levelIndex1: number, levelIndex2: number) {
			const level1 = levels[levelIndex1];
			const level2 = levels[levelIndex2];
			const array = levels.slice();
			array[levelIndex1] = level2;
			array[levelIndex2] = level1;
			setLevels(array);
		},
		resetLevels() {
			setLevels(ArkanoidLevels);
		},
	};
}
