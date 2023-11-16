"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EraserTool = void 0;
const util_1 = require("../util");
class EraserTool {
    constructor(width = 10, handleOpts) {
        this.width = width;
        handleOpts = handleOpts || {};
        this.handleOpts = {
            hide: handleOpts.hide || false,
            strokeWidth: handleOpts.strokeWidth || 2,
            fillColor: handleOpts.fillColor || "white",
            strokeColor: handleOpts.strokeColor || "black",
        };
    }
    /**
     * Draws an "eraser stroke" for all line segments
     * @param ctx
     * @param strokeParts
     */
    draw(ctx, strokeParts) {
        const { handleOpts } = this;
        const halfWidth = this.width / 2.0;
        strokeParts.forEach((strokePart) => {
            const { startPoint, endPoint, isEnd } = strokePart;
            const length = (0, util_1.getEuclidean)(startPoint, endPoint);
            const unitVect = (0, util_1.getUnitVector)(startPoint, endPoint);
            let currentPoint = startPoint;
            let i = 0;
            // clear all the way along the drag
            while (i < length) {
                const nextPoint = {
                    x: currentPoint.x + unitVect.x,
                    y: currentPoint.y + unitVect.y,
                };
                ctx.clearRect(nextPoint.x - halfWidth, nextPoint.y - halfWidth, this.width, this.width);
                i++;
                currentPoint = nextPoint;
            }
        });
        const lastPart = strokeParts[strokeParts.length - 1];
        // if the end is not the last part, then draw
        // the tool indicator at the endpoint
        if (!lastPart.isEnd && !handleOpts.hide) {
            ctx.strokeStyle = handleOpts.strokeColor;
            ctx.fillStyle = handleOpts.fillColor;
            ctx.fillRect(lastPart.endPoint.x - halfWidth, lastPart.endPoint.y - halfWidth, this.width, this.width);
            ctx.strokeRect(lastPart.endPoint.x - halfWidth + 0.5, lastPart.endPoint.y - halfWidth + 0.5, this.width - 1, this.width - 1);
        }
    }
}
exports.EraserTool = EraserTool;
//# sourceMappingURL=EraserTool.js.map