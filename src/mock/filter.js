// import { Filter, Point } from "../types/types";

import { filter } from '../utils';

// export const generateFilter = (points: Point[]) => Object.entries(points).map(
//   ([filterType: , filterCount]): Filter => ({
//     type: filterType,
//     count: filterCount(points).lenght
//   })
// );
export const generateFilter = (points) => Object.entries(filter).map(
  ([filterType, filterPoints]) => ({
    type: filterType,
    count: filterPoints(points).length > 0
  })
);

