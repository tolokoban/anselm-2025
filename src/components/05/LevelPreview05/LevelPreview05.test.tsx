import React from "react";
import { render } from "@testing-library/react";
import LevelPreview05 from "./LevelPreview05";

jest.mock("@/game/05/editor", () => ({
    useEditor: () => ({
        init: jest.fn(),
        installLevel: jest.fn(),
    }),
}));

describe("LevelPreview05", () => {
    const mockAssets = { bricks: [], balls: [], pads: [] };

    it("renders canvas element", () => {
        const { container } = render(
            <LevelPreview05 levelIndex={0} assets={mockAssets} />,
        );
        expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        const { container } = render(
            <LevelPreview05
                className="custom"
                levelIndex={0}
                assets={mockAssets}
            />,
        );
        const canvas = container.querySelector("canvas");
        expect(canvas).toHaveClass("custom");
    });
});
