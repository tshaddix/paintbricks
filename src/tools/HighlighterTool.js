"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlighterTool = void 0;
const color_alpha_1 = require("color-alpha");
class HighlighterTool {
    constructor(color = "yellow", width = 8, opacity = 0.3) {
        this.width = width;
        // calculate color w/ opacity
        this.color = (0, color_alpha_1.default)(color, 0.4);
    }
    /**
     * Draws a "highlighter stroke" for all line segments
     * @param ctx
     * @param strokeParts
     */
    draw(ctx, strokeParts) {
        const firstPart = strokeParts[0];
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.lineCap = "butt";
        ctx.miterLimit = 1;
        ctx.moveTo(firstPart.startPoint.x, firstPart.startPoint.y);
        strokeParts.forEach((strokePart) => {
            const { endPoint } = strokePart;
            ctx.lineTo(endPoint.x, endPoint.y);
        });
        ctx.stroke();
    }
}
exports.HighlighterTool = HighlighterTool;
//# sourceMappingURL=HighlighterTool.js.map