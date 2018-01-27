import { IStrokePart, IPoint } from "../types";
import { getUnitVector, getEuclidean } from "../util";

export interface IHandleOptions {
  hide: boolean;
  strokeWidth: number;
  fillColor: string;
  strokeColor: string;
}

export class EraserTool {
  readonly width: number;
  readonly handleOpts: IHandleOptions;
  private lastEndPoint: IPoint | null;

  constructor(width: number = 10, handleOpts?: Partial<IHandleOptions>) {
    this.width = width;
    this.lastEndPoint = null;

    handleOpts = handleOpts || {};

    this.handleOpts = {
      hide: handleOpts.hide || false,
      strokeWidth: handleOpts.strokeWidth || 2,
      fillColor: handleOpts.fillColor || "white",
      strokeColor: handleOpts.strokeColor || "black"
    };
  }

  /**
   * Draws an "eraser stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  public draw(ctx: CanvasRenderingContext2D, strokeParts: IStrokePart[]): void {
    const { handleOpts } = this;
    const halfWidth = this.width / 2.0;

    strokeParts.forEach(strokePart => {
      const { startPoint, endPoint, isEnd } = strokePart;

      const length = getEuclidean(startPoint, endPoint);
      const unitVect: IPoint = getUnitVector(startPoint, endPoint);
      let currentPoint: IPoint = startPoint;
      let i = 0;

      // clear all the way along the drag
      while (i < length) {
        const nextPoint: IPoint = {
          x: currentPoint.x + unitVect.x,
          y: currentPoint.y + unitVect.y
        };

        ctx.clearRect(
          nextPoint.x - halfWidth,
          nextPoint.y - halfWidth,
          this.width,
          this.width
        );

        i++;
        currentPoint = nextPoint;
      }
    });

    const lastPart = strokeParts[strokeParts.length - 1];

    // if the end is not the last part, then draw
    // the tool indicator at the endpoint
    if (!lastPart.isEnd && !handleOpts.hide) {
      ctx.strokeStyle = handleOpts.strokeColor;
      ctx.fillStyle = handleOpts.fillColor;

      ctx.fillRect(
        lastPart.endPoint.x - halfWidth,
        lastPart.endPoint.y - halfWidth,
        this.width,
        this.width
      );

      ctx.strokeRect(
        lastPart.endPoint.x - halfWidth + 0.5,
        lastPart.endPoint.y - halfWidth + 0.5,
        this.width - 1,
        this.width - 1
      );
    }
  }
}
