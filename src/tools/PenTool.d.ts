import { IStrokePart } from "../types";
export declare class PenTool {
  readonly color: string;
  readonly width: number;
  constructor(color?: string, width?: number);
  /**
   * Draws a "pen stroke" for all line segments
   * @param ctx
   * @param strokePart
   */
  draw(ctx: CanvasRenderingContext2D, strokePart: IStrokePart): void;
}
