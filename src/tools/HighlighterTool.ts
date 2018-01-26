import * as parseColor from "parse-color";

import {IStrokePart, IPoint} from "../types";

export class HighlighterTool {
  readonly color: string;
  readonly width: number;
  
  constructor (color: string = "yellow", width: number = 8, opacity: Number = 0.3) {
    this.width = width;
    
    // calculate rgba color w/ opacity
    const {rgb} = parseColor(color);
    this.color = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  }
  
  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokePart
   */
  public draw (ctx: CanvasRenderingContext2D, strokePart: IStrokePart): void {
    const {startPoint, endPoint, isStart, isEnd} = strokePart;
    
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.lineWidth = this.width;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    
    // join points draw circles where line segments will join
    const joinPoints: IPoint[] = [];
    // cap point draw square end caps to simulate a highlighter
    const capPoints: IPoint[] = [];
    
    if (!isStart) {
      joinPoints.push(startPoint);
    } else {
      capPoints.push(startPoint);
    }
    
    if (!isEnd) {
      joinPoints.push(endPoint);
    } else {
      capPoints.push(endPoint);
    }
    
    joinPoints.forEach(joinPoint => {
      ctx.beginPath();
      ctx.arc(joinPoint.x, joinPoint.y, this.width / 2, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    });
    
    // if there are end points, then add a square end point
    if (capPoints.length) {
      // get the angle of the line (radians)
      const lineAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
      
      ctx.rotate(lineAngle);
      
      capPoints.forEach(capPoint => {
        ctx.fillStyle = this.color;
        ctx.fillRect(
          capPoint.x - (this.width / 2.0),
          capPoint.y - (this.width / 2.0), 
          this.width,
          this.width
        );
      });
      
      ctx.rotate(-lineAngle);
    }
  }
}