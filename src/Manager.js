"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const StrokeManager_1 = require("./StrokeManager");
class Manager {
    constructor(canvas, canvasWidth, canvasHeight) {
        this.canvas = canvas;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.currentTool = null;
        this.currentStroke = [];
        this.strokeManager = new StrokeManager_1.StrokeManager(canvas);
        this.canvasState = null;
        this.shouldDraw = false;
        this.shouldCommit = false;
        // find pixel ratio relative to backing store and device ratio
        const bsr = canvas.getContext("2d").backingStorePixelRatio || 1;
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
    setCanvasSize(width, height) {
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
    setTool(tool) {
        this.currentTool = tool;
    }
    /**
     * Remove all event listeners
     */
    destroy() {
        // cancel animation loop
        window.cancelAnimationFrame(this.nextAnimationFrame);
        // remove all listeners on stroke manager
        this.strokeManager.destroy();
    }
    /**
     * Clears the canvas
     */
    clear() {
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
    onStrokePart(strokePart) {
        this.currentStroke.push(strokePart);
        this.shouldDraw = true;
        if (strokePart.isEnd) {
            this.shouldCommit = true;
        }
    }
    /**
     * Draws a frame
     */
    draw() {
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
            this.canvasState = ctx.getImageData(0, 0, this.canvasWidth * this.pixelRatio, this.canvasHeight * this.pixelRatio);
            this.currentStroke = [];
            this.shouldCommit = false;
        }
        this.shouldDraw = false;
    }
}
exports.Manager = Manager;
//# sourceMappingURL=Manager.js.map