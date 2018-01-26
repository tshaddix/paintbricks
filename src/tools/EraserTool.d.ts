import { IStrokePart } from "../types";
export declare class EraserTool {
  readonly width: number;
  constructor(width?: number);
  /**
   * Draws an "eraser stroke" for all line segments
   * @param ctx
   * @param strokePart
   */
  draw(ctx: CanvasRenderingContext2D, strokePart: IStrokePart): void;
}
