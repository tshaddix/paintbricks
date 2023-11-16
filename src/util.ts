import { IPoint } from "./types";

/**
 * Get the distance between two points
 * @param p1
 * @param p2
 * @returns number
 */
export function getEuclidean(p1: IPoint, p2: IPoint): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * Gets the unit vector representing the vector from start
 * point to end point with a length of 1.
 * @param startPoint
 * @param endPoint
 * @returns IPoint
 */
export function getUnitVector(startPoint: IPoint, endPoint: IPoint): IPoint {
  const length = getEuclidean(startPoint, endPoint);

  const dirVect = {
    x: endPoint.x - startPoint.x,
    y: endPoint.y - startPoint.y,
  };

  const unitVect: IPoint = {
    x: dirVect.x / length,
    y: dirVect.y / length,
  };

  return unitVect;
}
