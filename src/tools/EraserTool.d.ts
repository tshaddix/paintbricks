import { IStrokePart } from "../types";
export interface IHandleOptions {
    hide: boolean;
    strokeWidth: number;
    fillColor: string;
    strokeColor: string;
}
export declare class EraserTool {
    readonly width: number;
    readonly handleOpts: IHandleOptions;
    private lastEndPoint;
    constructor(width?: number, handleOpts?: Partial<IHandleOptions>);
    /**
     * Draws an "eraser stroke" for all line segments
     * @param ctx
     * @param strokeParts
     */
    draw(ctx: CanvasRenderingContext2D, strokeParts: IStrokePart[]): void;
}
