import { IStrokePart } from "../types";
export declare class HighlighterTool {
    readonly color: string;
    readonly width: number;
    constructor(color?: string, width?: number, opacity?: number);
    /**
     * Draws a "highlighter stroke" for all line segments
     * @param ctx
     * @param strokeParts
     */
    draw(ctx: CanvasRenderingContext2D, strokeParts: IStrokePart[], canvasWidth: number, canvasHeight: number): void;
}
