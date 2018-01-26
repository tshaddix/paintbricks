import {IPoint, IStrokePart} from "./types";

export interface IOnStrokePartHandler {
  (strokePart: IStrokePart): void;
}

export interface ITouch {
  id: number;
  position: IPoint;
}

export class StrokeManager {
  // reference to canvas element
  private canvas: HTMLCanvasElement;
  // holds last touch point in a drag
  private lastTouch: ITouch | null;
  // value indicates how sensitive the stroke detection is higher is better
  private sensitivity: number;
  // holds all of the last emitted stroke parts in a drag
  private lastStrokeParts: IStrokePart[];
  // the handlers listening for new strokes
  private onStrokePartHandlers: IOnStrokePartHandler[];
  
  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.lastTouch = null;
    this.sensitivity = 0.0;
    this.lastStrokeParts = [];
    this.onStrokePartHandlers = [];
    
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchCancel = this.onTouchCancel.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.destroy = this.destroy.bind(this);
    this.getRelativePosition = this.getRelativePosition.bind(this);
    
    this.canvas.addEventListener("touchstart", this.onTouchStart, {passive: false});
    this.canvas.addEventListener("touchend", this.onTouchEnd, {passive: false});
    this.canvas.addEventListener("touchcancel", this.onTouchCancel, {passive: false});
    this.canvas.addEventListener("touchmove", this.onTouchMove, {passive: false});
  }
  
  /**
   * Registers a handler to be fired on a new stroke part
   * @param handler
   */
  public onStrokePart (handler: IOnStrokePartHandler): void {
    this.onStrokePartHandlers.push(handler);
  }
  
  /**
   * Removes all active listeners
   */
  public destroy (): void {
    this.onStrokePartHandlers = [];
    this.lastStrokeParts = [];
    this.canvas.removeEventListener("touchstart", this.onTouchStart);
    this.canvas.removeEventListener("touchend", this.onTouchEnd);
    this.canvas.removeEventListener("touchcancel", this.onTouchCancel);
    this.canvas.removeEventListener("touchmove", this.onTouchMove);
  }
  
  /**
   * Get relative position to canvas
   * @param clientX
   * @param clientY
   * @returns IPoint
   */
  private getRelativePosition(clientX: number, clientY: number): IPoint {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  
  /**
   * Get the distance between two points
   * @param p1
   * @param p2
   * @returns number
   */
  private getEuclidean(p1: IPoint, p2: IPoint): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  
  /**
   * Creates a new touch if one does not
   * already exist
   * @param e
   */
  private onTouchStart (e: TouchEvent): void {
    e.preventDefault();
    
    // if there is an ongoing touch, ignore this event
    if (this.lastTouch) {
      return;
    }
    
    const touches: TouchList = e.changedTouches;
    
    // only get the first touch
    const touch = touches.item(0);
    
    // save the touch
    this.lastTouch = {
      id: touch.identifier,
      position: this.getRelativePosition(touch.clientX, touch.clientY)
    };
  }
  
  /**
   * Creates a line from last touch to current touch
   * point and emits event. Does no-op if no existing touch
   * @param e
   */
  private onTouchMove (e: TouchEvent): void {
    e.preventDefault();
    
    // if no last touch... something is wrong
    if (!this.lastTouch) {
      return;
    }
    
    const touches: TouchList = e.changedTouches;
    
    // find the current touch we are tracking
    const touch: Touch = Array.from(touches).find(touch => {
      return touch.identifier === this.lastTouch.id;
    }); 
    
    // if the touch was not one we were tracking,
    // ignore and no-op
    if (!touch) {
      return;
    }
    
    const nextTouch: ITouch = {
      id: touch.identifier,
      position: this.getRelativePosition(touch.clientX, touch.clientY)
    };
    
    // If sensitivity setting has been set,
    // check if this point is far enough from last
    // touch to be drawn
    if (this.sensitivity &&
      this.getEuclidean(nextTouch.position, this.lastTouch.position) < (10.0 / this.sensitivity)) {
      return;
    }
    
    const strokePart: IStrokePart = {
      endPoint: nextTouch.position,
      startPoint: this.lastTouch.position,
      isStart: this.lastStrokeParts.length === 0,
      isEnd: false
    };
    
    this.onStrokePartHandlers.forEach(handler => {
      handler(strokePart);
    });
    
    // save this touch as last touch
    this.lastTouch = nextTouch;
    this.lastStrokeParts.push(strokePart);
  }
  
  /**
   * Draws a line from last point to final point. Removes
   * the reference to last touch point.
   * @param e
   */
  private onTouchEnd (e: TouchEvent): void {
    e.preventDefault();
    
    // if no last touch... something is wrong
    if (!this.lastTouch) {
      return;
    }
    
    const touches: TouchList = e.changedTouches;
    
    // find the current touch we are tracking
    const touch: Touch = Array.from(touches).find(touch => {
      return touch.identifier === this.lastTouch.id;
    }); 
    
    // if the touch was not one we were tracking,
    // ignore and no-op
    if (!touch) {
      return;
    }
    
    const endPoint = this.getRelativePosition(touch.clientX, touch.clientY);
    
    const strokePart: IStrokePart = {
      startPoint: this.lastTouch.position,
      endPoint,
      isStart: false,
      isEnd: true
    };
    
    this.onStrokePartHandlers.forEach(handler => {
      handler(strokePart);
    });
    
    this.lastTouch = null;
    this.lastStrokeParts = [];
  }
  
  /**
   * Removes the current last touch point
   * @param e
   */
  private onTouchCancel (e: TouchEvent): void {
    e.preventDefault();
    this.lastTouch = null;
    this.lastStrokeParts = [];
  }
}