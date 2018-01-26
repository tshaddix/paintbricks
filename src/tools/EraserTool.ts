import {IStrokePart} from "../types";

export class EraserTool {
  readonly width: number;
  
  constructor (width: number = 10) {
    this.width = width;
  }
  
  /**
   * Draws an "eraser stroke" for all line segments
   * @param ctx
   * @param strokePart
   */
  public draw (ctx: CanvasRenderingContext2D, strokePart: IStrokePart): void {
    const {startPoint, endPoint} = strokePart;
    
    // todo Move along the line using clear react
  }
}