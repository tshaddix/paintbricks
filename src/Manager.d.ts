import { ITool } from "./types";
export declare class Manager {
    private canvas;
    private strokeManager;
    private pixelRatio;
    private canvasWidth;
    private canvasHeight;
    private nextAnimationFrame;
    private currentTool;
    private nextStrokes;
    constructor(canvas: HTMLCanvasElement, canvasWidth: number, canvasHeight: number);
    /**
     * Sets the canvas desired width and height and sets transform
     * for hifi displays
     * @param width
     * @param height
     */
    setCanvasSize(width: number, height: number): void;
    /**
     * Sets the current tool for the manager
     * @param tool
     */
    setTool(tool: ITool): void;
    /**
     * Remove all event listeners
     */
    destroy(): void;
    /**
     * Clears the canvas
     */
    clear(): void;
    /**
     * Adds a new stroke part to the nextStrokes
     * array
     * @param strokePart
     */
    private onStrokePart(strokePart);
    /**
     * Draws a frame
     */
    private draw();
}
