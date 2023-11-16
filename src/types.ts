export interface IPoint {
  x: number;
  y: number;
}

export interface IStrokePart extends ILine {
  isStart: boolean;
  isEnd: boolean;
}

export interface ILine {
  startPoint: IPoint;
  endPoint: IPoint;
}

export interface ITool {
  draw(
    ctx: CanvasRenderingContext2D,
    strokeParts: IStrokePart[],
    canvasWidth: number,
    canvasHeight: number,
  ): void;
}
