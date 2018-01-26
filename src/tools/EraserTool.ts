import { IStrokePart, IPoint } from "../types";
import {getUnitVector} from "../util";

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
   * @param strokePart
   */
  public draw(ctx: CanvasRenderingContext2D, strokePart: IStrokePart): void {
    const { startPoint, endPoint, isEnd } = strokePart;
    const { handleOpts } = this;

    const halfWidth = this.width / 2.0;
    
    const unitVect: IPoint = getUnitVector(startPoint, endPoint);
    let currentPoint: IPoint = startPoint;
    let i = 0;
    
    // clean up tool handle from 
    // last draw if exists and we are not hiding
    if (this.lastEndPoint && !handleOpts.hide) {
      ctx.clearRect(
        this.lastEndPoint.x - halfWidth - 1,
        this.lastEndPoint.y - halfWidth - 1,
        this.width + 2,
        this.width + 2
      );
    }
    
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
    
    // if not the last part, then draw
    // the tool indicator at the endpoint
    if (!isEnd) {
      this.lastEndPoint = endPoint;
      
      // draw handle
      if (!handleOpts.hide) {
        ctx.strokeStyle = handleOpts.strokeColor;
        ctx.fillStyle = handleOpts.fillColor;
        
        ctx.fillRect(
          endPoint.x - halfWidth,
          endPoint.y - halfWidth,
          this.width,
          this.width
        );
        
        ctx.strokeRect(
          endPoint.x - halfWidth + 0.5,
          endPoint.y - halfWidth + 0.5,
          this.width - 1,
          this.width - 1
        );
      }
    } else {
      this.lastEndPoint = null;
    }
  }
}
