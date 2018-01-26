import * as parseColor from "parse-color";

import { IStrokePart, IPoint } from "../types";
import {getUnitVector, getEuclidean} from "../util";

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
   * @param strokePart
   */
  public draw(ctx: CanvasRenderingContext2D, strokePart: IStrokePart): void {
    const { startPoint, endPoint, isStart, isEnd } = strokePart;
    const {lastStrokePart} = this;

    ctx.beginPath();
    
    if (lastStrokePart) {
      // get the vector direction of last stroke
      const lastUnitVec = getUnitVector(lastStrokePart.startPoint, lastStrokePart.endPoint);
      const lastLength = getEuclidean(lastStrokePart.startPoint, lastStrokePart.endPoint);
      const lastBufferAmount = Math.min(1.0, lastLength);
      
      // move to the buffer point of last stroke
      ctx.moveTo(endPoint.x - lastUnitVec.x * lastBufferAmount, endPoint.y - lastUnitVec.y * lastBufferAmount);
      ctx.lineTo(startPoint.x, startPoint.y);
      
      // only move to buffer
      const nextUnitVec = getUnitVector(startPoint, endPoint);
      const nextLength = getEuclidean(startPoint, endPoint);
      const nextBufferAmount = Math.min(1.0, nextLength);
      
      const bufferEndPoint = {
        x: startPoint.x + nextUnitVec.x * (nextLength - nextBufferAmount),
        y: startPoint.y + nextUnitVec.y * (nextLength - nextBufferAmount)
      };
      
      ctx.lineTo(bufferEndPoint.x, bufferEndPoint.y);
    } else {
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
    }
    
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    
    // if this is the last part,
    // remove the last stroke part
    // ref as there will be no more
    if (isEnd) {
      this.lastStrokePart = null;
    } else {
      this.lastStrokePart = strokePart;
    }
  }
}
