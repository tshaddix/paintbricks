"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenTool = void 0;
class PenTool {
    constructor(color = "red", width = 3) {
        this.color = color;
        this.width = width;
    }
    /**
     * Draws a "pen stroke" for all line segments
     * @param ctx
     * @param strokeParts
     */
    draw(ctx, strokeParts) {
        const firstPart = strokeParts[0];
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(firstPart.startPoint.x, firstPart.startPoint.y);
        strokeParts.forEach((strokePart) => {
            const { endPoint } = strokePart;
            ctx.lineTo(endPoint.x, endPoint.y);
        });
        ctx.stroke();
    }
}
exports.PenTool = PenTool;
//# sourceMappingURL=PenTool.js.map