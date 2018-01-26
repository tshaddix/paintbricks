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
   * @param strokePart
   */
  public draw(ctx: CanvasRenderingContext2D, strokePart: IStrokePart): void {
    const { startPoint, endPoint, isStart, isEnd } = strokePart;

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    [startPoint, endPoint].forEach(capPoint => {
      ctx.beginPath();
      ctx.arc(capPoint.x, capPoint.y, this.width / 2, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    });
  }
}
