import { IPoint } from "./types";
/**
 * Get the distance between two points
 * @param p1
 * @param p2
 * @returns number
 */
export declare function getEuclidean(p1: IPoint, p2: IPoint): number;
/**
 * Gets the unit vector representing the vector from start
 * point to end point with a length of 1.
 * @param startPoint
 * @param endPoint
 * @returns IPoint
 */
export declare function getUnitVector(startPoint: IPoint, endPoint: IPoint): IPoint;
