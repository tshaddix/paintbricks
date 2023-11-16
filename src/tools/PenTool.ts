import { IStrokePart } from "../types";

export class PenTool {
  readonly color: string;
  readonly width: number;

  constructor(color: string = "red", width: number = 3) {
    this.color = color;
    this.width = width;
  }

  /**
   * Draws a "pen stroke" for all line segments
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
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

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
