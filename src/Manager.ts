import { IStrokePart, ITool } from "./types";
import { StrokeManager } from "./StrokeManager";

export class Manager {
  // reference to the canvas
  private canvas: HTMLCanvasElement;
  // reference to stroke manager
  private strokeManager: StrokeManager;
  // holds the pixel ratio between canvas backing
  // store and device ratio (used for hi fi displays)
  private pixelRatio: number;
  // the width of the canvas
  private canvasWidth: number;
  // the height of the canvas
  private canvasHeight: number;
  // holds a reference to next animation frame
  private nextAnimationFrame: number;
  // the currently selected tool
  private currentTool: ITool | null;
  // holds stroke parts for ongoing stroke
  private currentStroke: IStrokePart[];
  // the state of the canvas (not including ongoing stroke)
  private canvasState: ImageData | null;
  // indicates whether changes have occured that require redraw
  private shouldDraw: boolean;
  // indicates whether canvas should commit its next draw state to current state
  private shouldCommit: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    this.canvas = canvas;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.currentTool = null;
    this.currentStroke = [];
    this.strokeManager = new StrokeManager(canvas);
    this.canvasState = null;
    this.shouldDraw = false;
    this.shouldCommit = false;

    // find pixel ratio relative to backing store and device ratio
    const bsr = (canvas.getContext("2d") as any).backingStorePixelRatio || 1;
    const dpr = window.devicePixelRatio || 1;
    this.pixelRatio = dpr / bsr;

    this.setCanvasSize = this.setCanvasSize.bind(this);
    this.setTool = this.setTool.bind(this);
    this.destroy = this.destroy.bind(this);
    this.clear = this.clear.bind(this);
    this.draw = this.draw.bind(this);
    this.onStrokePart = this.onStrokePart.bind(this);

    // schedule animation frame loop
    this.nextAnimationFrame = window.requestAnimationFrame(this.draw);
    // set up listener for new stroke part
    this.strokeManager.onStrokePart(this.onStrokePart);

    this.setCanvasSize(canvasWidth, canvasHeight);
  }

  /**
   * Sets the canvas desired width and height and sets transform
   * for hifi displays
   * @param width
   * @param height
   */
  public setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;

    const { canvas, canvasWidth, canvasHeight, pixelRatio } = this;

    const ctx = canvas.getContext("2d");

    // appropriately scale canvas to map to device ratio
    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  /**
   * Sets the current tool for the manager
   * @param tool
   */
  public setTool(tool: ITool): void {
    this.currentTool = tool;
  }

  /**
   * Remove all event listeners
   */
  public destroy(): void {
    // cancel animation loop
    window.cancelAnimationFrame(this.nextAnimationFrame);
    // remove all listeners on stroke manager
    this.strokeManager.destroy();
  }

  /**
   * Clears the canvas
   */
  public clear(): void {
    this.canvasState = null;
    this.currentStroke = [];
    this.shouldDraw = true;
    this.shouldCommit = true;
  }

  /**
   * Adds a new stroke part to the nextStrokes
   * array
   * @param strokePart
   */
  private onStrokePart(strokePart: IStrokePart): void {
    this.currentStroke.push(strokePart);

    this.shouldDraw = true;

    if (strokePart.isEnd) {
      this.shouldCommit = true;
    }
  }

  /**
   * Draws a frame
   */
  private draw(): void {
    // schedule next draw
    this.nextAnimationFrame = window.requestAnimationFrame(this.draw);

    const ctx = this.canvas.getContext("2d");

    if (!this.shouldDraw) {
      return;
    }

    // clear canvas
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // draw current state
    if (this.canvasState) {
      ctx.putImageData(this.canvasState, 0, 0);
    }

    // if a tool has been selected and there are
    // pending strokes, draw them
    if (this.currentTool && this.currentStroke.length) {
      ctx.save();
      this.currentTool.draw(ctx, this.currentStroke);
      ctx.restore();
    }

    // if all changes have been made for current stroke,
    // save it as the new canvas state
    if (this.shouldCommit) {
      this.canvasState = ctx.getImageData(
        0,
        0,
        this.canvasWidth * this.pixelRatio,
        this.canvasHeight * this.pixelRatio,
      );
      this.currentStroke = [];
      this.shouldCommit = false;
    }

    this.shouldDraw = false;
  }
}
