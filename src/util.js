"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnitVector = exports.getEuclidean = void 0;
/**
 * Get the distance between two points
 * @param p1
 * @param p2
 * @returns number
 */
function getEuclidean(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
exports.getEuclidean = getEuclidean;
/**
 * Gets the unit vector representing the vector from start
 * point to end point with a length of 1.
 * @param startPoint
 * @param endPoint
 * @returns IPoint
 */
function getUnitVector(startPoint, endPoint) {
    const length = getEuclidean(startPoint, endPoint);
    const dirVect = {
        x: endPoint.x - startPoint.x,
        y: endPoint.y - startPoint.y,
    };
    const unitVect = {
        x: dirVect.x / length,
        y: dirVect.y / length,
    };
    return unitVect;
}
exports.getUnitVector = getUnitVector;
//# sourceMappingURL=util.js.map