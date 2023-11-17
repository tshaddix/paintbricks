import { IPoint, IStrokePart } from "./types";
export interface IOnStrokePartHandler {
    (strokePart: IStrokePart): void;
}
export interface ITouch {
    id: number;
    position: IPoint;
}
export declare class StrokeManager {
    private canvas;
    private lastTouch;
    private lastMouse;
    private sensitivity;
    private lastStrokeParts;
    private onStrokePartHandlers;
    constructor(canvas: HTMLCanvasElement);
    /**
     * Registers a handler to be fired on a new stroke part
     * @param handler
     */
    onStrokePart(handler: IOnStrokePartHandler): void;
    /**
     * Removes all active listeners
     */
    destroy(): void;
    /**
     * Get relative position to canvas
     * @param clientX
     * @param clientY
     * @returns IPoint
     */
    private getRelativePosition;
    /**
     * Creates a new touch if one does not
     * already exist
     * @param e
     */
    private onTouchStart;
    /**
     * Creates a line from last touch to current touch
     * point and emits event. Does no-op if no existing touch
     * @param e
     */
    private onTouchMove;
    /**
     * Draws a line from last point to final point. Removes
     * the reference to last touch point.
     * @param e
     */
    private onTouchEnd;
    /**
     * Removes the current last touch point
     * @param e
     */
    private onTouchCancel;
    private onMouseDown;
    private onMouseUp;
    private onMouseMove;
}
