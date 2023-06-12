import { FILTER } from '../const';
import { Point } from '../types/types';


export const generateFilter = (points: Point[]) => Object.entries(FILTER).map(
  ([type, filter]) => ({
    type,
    count: filter(points).length
  })
);

