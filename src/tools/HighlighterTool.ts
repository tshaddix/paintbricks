import alpha from "color-alpha";

import { IStrokePart } from "../types";

export class HighlighterTool {
  readonly color: string;
  readonly width: number;

  constructor(
    color: string = "yellow",
    width: number = 8,
    opacity: number = 0.3,
  ) {
    this.width = width;

    // calculate color w/ opacity
    this.color = alpha(color, opacity);
  }

  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    strokeParts: IStrokePart[],
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const firstPart = strokeParts[0];

    ctx.beginPath();

    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.lineCap = "butt";
    ctx.miterLimit = 1;

    ctx.moveTo(
      firstPart.startPoint.x * canvasWidth,
      firstPart.startPoint.y * canvasHeight,
    );

    strokeParts.forEach((strokePart) => {
      const { endPoint } = strokePart;
      ctx.lineTo(endPoint.x * canvasWidth, endPoint.y * canvasHeight);
    });

    ctx.stroke();
  }
}
