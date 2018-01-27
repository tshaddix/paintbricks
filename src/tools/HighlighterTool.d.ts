import { IStrokePart } from "../types";
export declare class HighlighterTool {
  readonly color: string;
  readonly width: number;
  private lastStrokePart;
  constructor(color?: string, width?: number, opacity?: Number);
  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(ctx: CanvasRenderingContext2D, strokeParts: IStrokePart[]): void;
}
