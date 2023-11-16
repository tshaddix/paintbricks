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

  constructor(width: number = 10, handleOpts?: Partial<IHandleOptions>) {
    this.width = width;

    handleOpts = handleOpts || {};

    this.handleOpts = {
      hide: handleOpts.hide || false,
      strokeWidth: handleOpts.strokeWidth || 2,
      fillColor: handleOpts.fillColor || "white",
      strokeColor: handleOpts.strokeColor || "black",
    };
  }

  /**
   * Draws an "eraser stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    strokeParts: IStrokePart[],
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const { handleOpts } = this;
    const halfWidth = this.width / 2.0;

    strokeParts.forEach((strokePart) => {
      const { startPoint, endPoint } = strokePart;

      const length = getEuclidean(startPoint, endPoint);
      const unitVect: IPoint = getUnitVector(startPoint, endPoint);
      let currentPoint: IPoint = startPoint;
      let i = 0;

      // clear all the way along the drag
      while (i < length) {
        const nextPoint: IPoint = {
          x: currentPoint.x * canvasWidth + unitVect.x,
          y: currentPoint.y * canvasHeight + unitVect.y,
        };

        ctx.clearRect(
          nextPoint.x - halfWidth,
          nextPoint.y - halfWidth,
          this.width,
          this.width,
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

      const lastEndPoint = {
        x: lastPart.endPoint.x * canvasWidth,
        y: lastPart.endPoint.y * canvasHeight,
      };

      ctx.fillRect(
        lastEndPoint.x - halfWidth,
        lastEndPoint.y - halfWidth,
        this.width,
        this.width,
      );

      ctx.strokeRect(
        lastEndPoint.x - halfWidth + 0.5,
        lastEndPoint.y - halfWidth + 0.5,
        this.width - 1,
        this.width - 1,
      );
    }
  }
}
