import { tgdLoadAssets, type WebglImage } from "@tolokoban/tgd";
import React from "react";
import AtlasBallsURL from "@/gfx/05/balls.webp";
import AtlasBonusesURL from "@/gfx/05/bonuses.webp";
import AtlasBricksURL from "@/gfx/05/bricks.webp";
import AtlasLaserURL from "@/gfx/05/laser.webp";
import AtlasPadsURL from "@/gfx/05/pads.webp";
import Game from "./_/Game";
import Spinner from "./_/Spinner";

export default function Page05() {
	const [images, setImages] = React.useState<WebglImage[] | undefined>(
		undefined,
	);
	React.useEffect(() => {
		const all = Promise.all([
			tgdLoadAssets({
				img: {
					atlasBalls: AtlasBallsURL,
					atlasBricks: AtlasBricksURL,
					atlasBonuses: AtlasBonusesURL,
					atlasPads: AtlasPadsURL,
					atlasLasers: AtlasLaserURL,
				},
			}),
			sleep(1),
		]);
		all.then(([assets]) => {
			const { atlasBalls, atlasBricks, atlasBonuses, atlasPads, atlasLasers } =
				assets.img;
			if (
				!atlasBalls ||
				!atlasBricks ||
				!atlasBonuses ||
				!atlasPads ||
				!atlasLasers
			) {
				console.error("Unable to load atlas:", AtlasBricksURL);
				throw new Error("Unable to load atlas!");
			}
			setImages([
				atlasBalls,
				atlasBricks,
				atlasBonuses,
				atlasPads,
				atlasLasers,
			]);
		});
	}, []);

	if (!images) return <Spinner />;

	const [atlasBalls, atlasBricks, atlasBonuses, atlasPads, atlasLasers] =
		images;
	return (
		<Game
			assets={{ atlasBalls, atlasBricks, atlasBonuses, atlasPads, atlasLasers }}
		/>
	);
}

function sleep(delay: number) {
	return new Promise((resolve) => globalThis.setTimeout(resolve, delay));
}
