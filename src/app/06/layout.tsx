import type React from "react";
import LandscapeView from "@/components/LandscapeView";
import Background from "@/generated/background-02";

import Styles from "./layout.module.css";

export default function LayoutBackground({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={Styles.Layoutbackground}>
			<Background type="background" />
			{children}
		</div>
	);
}
