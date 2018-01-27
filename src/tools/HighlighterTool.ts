import * as parseColor from "parse-color";

import { IStrokePart, IPoint } from "../types";
import { getUnitVector, getEuclidean } from "../util";

export class HighlighterTool {
  readonly color: string;
  readonly width: number;
  private lastStrokePart: IStrokePart | null;

  constructor(
    color: string = "yellow",
    width: number = 8,
    opacity: Number = 0.3
  ) {
    this.width = width;
    this.lastStrokePart = null;

    // calculate rgba color w/ opacity
    const { rgb } = parseColor(color);
    this.color = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  }

  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  public draw(ctx: CanvasRenderingContext2D, strokeParts: IStrokePart[]): void {
    const firstPart = strokeParts[0];

    ctx.beginPath();

    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.lineCap = "butt";
    ctx.miterLimit = 1;

    ctx.moveTo(firstPart.startPoint.x, firstPart.startPoint.y);

    strokeParts.forEach(strokePart => {
      const { endPoint } = strokePart;
      ctx.lineTo(endPoint.x, endPoint.y);
    });

    ctx.stroke();
  }
}
