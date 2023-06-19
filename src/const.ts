import { Point } from './types/types';
import { getDayDifference, getPriceDifference, getTimeDifference, isPointFuture, isPointPast, isPointPresent } from './utils';

const VALUE = 4;

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
] as const;

const CITIES = [
  'Monaco',
  'Tokio',
  'Amsterdam',
  'Paris',
  'Yerevan',
  'Vienna',
  'Minsk',
  'Santiago',
  'Havana',
  'Rome',
  'London',
  'Berlin',
  'Madrid',
  'Prague',
  'Moscow',
] as const;

const DESCRIPTION = 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const MSEC_IN_HOUR = 3600000;
const MSEC_IN_DAY = 86400000;

const FORMAT_DURATION = {
  'mm': 'mm[M]',
  'HHmm': 'HH[H] mm[M]',
  'DDHHmm': 'DD[D] HH[H] mm[M]'
} as const;

type FilterType = 'everything' | 'future' | 'present' | 'past';
type PointFilter = (points: Point[]) => Point[];

const filter: Record<FilterType, PointFilter> = {
  'everything': (points: Point[]) => points,
  'future': (points: Point[]) => points.filter(isPointFuture),
  'present': (points: Point[]) => points.filter(isPointPresent),
  'past': (points: Point[]) => points.filter(isPointPast),
};

type SortType = 'day' | 'event' | 'time' | 'price' | 'offer';
type PointSort = (points: Point[]) => Point[];

const sort: Record<SortType, PointSort> = {
  'day': (points: Point[]) => [...points].sort(getDayDifference),
  'time': (points: Point[]) => [...points].sort(getTimeDifference),
  'price': (points: Point[]) => [...points].sort(getPriceDifference),
  'event': () => {
    throw new Error('sorting not available');
  },
  'offer': () => {
    throw new Error('sorting not available');
  },
};


export {VALUE, TYPES, CITIES, DESCRIPTION, MSEC_IN_DAY, MSEC_IN_HOUR, FORMAT_DURATION, FilterType, filter, SortType, sort};
