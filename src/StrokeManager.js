"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrokeManager = void 0;
const util_1 = require("./util");
class StrokeManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.lastTouch = null;
        this.sensitivity = 20.0;
        this.lastStrokeParts = [];
        this.onStrokePartHandlers = [];
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.destroy = this.destroy.bind(this);
        this.getRelativePosition = this.getRelativePosition.bind(this);
        this.canvas.addEventListener("touchstart", this.onTouchStart, {
            passive: false,
        });
        this.canvas.addEventListener("touchend", this.onTouchEnd, {
            passive: false,
        });
        this.canvas.addEventListener("touchcancel", this.onTouchCancel, {
            passive: false,
        });
        this.canvas.addEventListener("touchmove", this.onTouchMove, {
            passive: false,
        });
    }
    /**
     * Registers a handler to be fired on a new stroke part
     * @param handler
     */
    onStrokePart(handler) {
        this.onStrokePartHandlers.push(handler);
    }
    /**
     * Removes all active listeners
     */
    destroy() {
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
    getRelativePosition(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }
    /**
     * Creates a new touch if one does not
     * already exist
     * @param e
     */
    onTouchStart(e) {
        e.preventDefault();
        // if there is an ongoing touch, ignore this event
        if (this.lastTouch) {
            return;
        }
        const touches = e.changedTouches;
        // only get the first touch
        const touch = touches.item(0);
        // save the touch
        this.lastTouch = {
            id: touch.identifier,
            position: this.getRelativePosition(touch.clientX, touch.clientY),
        };
    }
    /**
     * Creates a line from last touch to current touch
     * point and emits event. Does no-op if no existing touch
     * @param e
     */
    onTouchMove(e) {
        e.preventDefault();
        // if no last touch... something is wrong
        if (!this.lastTouch) {
            return;
        }
        const touches = e.changedTouches;
        // find the current touch we are tracking
        const touch = Array.from(touches).find((touch) => {
            return touch.identifier === this.lastTouch.id;
        });
        // if the touch was not one we were tracking,
        // ignore and no-op
        if (!touch) {
            return;
        }
        const nextTouch = {
            id: touch.identifier,
            position: this.getRelativePosition(touch.clientX, touch.clientY),
        };
        // If sensitivity setting has been set,
        // check if this point is far enough from last
        // touch to be drawn
        if (this.sensitivity &&
            (0, util_1.getEuclidean)(nextTouch.position, this.lastTouch.position) <
                10.0 / this.sensitivity) {
            return;
        }
        const strokePart = {
            endPoint: nextTouch.position,
            startPoint: this.lastTouch.position,
            isStart: this.lastStrokeParts.length === 0,
            isEnd: false,
        };
        this.onStrokePartHandlers.forEach((handler) => {
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
    onTouchEnd(e) {
        e.preventDefault();
        // if no last touch... something is wrong
        if (!this.lastTouch) {
            return;
        }
        const touches = e.changedTouches;
        // find the current touch we are tracking
        const touch = Array.from(touches).find((touch) => {
            return touch.identifier === this.lastTouch.id;
        });
        // if the touch was not one we were tracking,
        // ignore and no-op
        if (!touch) {
            return;
        }
        const endPoint = this.getRelativePosition(touch.clientX, touch.clientY);
        const strokePart = {
            startPoint: this.lastTouch.position,
            endPoint,
            isStart: false,
            isEnd: true,
        };
        this.onStrokePartHandlers.forEach((handler) => {
            handler(strokePart);
        });
        this.lastTouch = null;
        this.lastStrokeParts = [];
    }
    /**
     * Removes the current last touch point
     * @param e
     */
    onTouchCancel(e) {
        e.preventDefault();
        this.lastTouch = null;
        this.lastStrokeParts = [];
    }
}
exports.StrokeManager = StrokeManager;
//# sourceMappingURL=StrokeManager.js.map