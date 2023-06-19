import { filter } from '../const';
import { Point } from '../types/types';


export const generateFilter = (points: Point[]) => Object.entries(filter).map(
  ([type, filterCount]) => ({
    type,
    count: filterCount(points).length
  })
);

