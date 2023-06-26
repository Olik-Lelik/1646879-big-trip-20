import { Point, State } from './types/types';
import { dayjs, getDayDifference, getPriceDifference, getTimeDifference, isPointFuture, isPointPast, isPointPresent } from './utils';
import type { ServiceProps } from './service';

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

const MSEC_IN_HOUR = 3_600_000;
const MSEC_IN_DAY = 86_400_000;

const FORMAT_DURATION = {
  'mm': 'mm[M]',
  'HHmm': 'HH[H] mm[M]',
  'DDHHmm': 'DD[D] HH[H] mm[M]'
} as const;

const UpdateType = {
  PATCH :'patch',
  MINOR :'minor',
  MAJOR :'major',
  INIT :'init'
} as const;

type UserAction = 'update_point' | 'add_point' | 'delete_point';
type UpdateType = 'patch' | 'minor' | 'major' | 'init';

type FilterType = 'EVERYTHING' | 'FUTURE' | 'PRESENT' | 'PAST';
type PointFilter = (points: Point[]) => Point[];

const filter: Record<FilterType, PointFilter> = {
  'EVERYTHING': (points: Point[]) => points,
  'FUTURE': (points: Point[]) => points.filter(isPointFuture),
  'PRESENT': (points: Point[]) => points.filter(isPointPresent),
  'PAST': (points: Point[]) => points.filter(isPointPast),
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

const SERVICE_OPTIONS: ServiceProps = {
  endPoint: 'https://20.ecmascript.pages.academy/big-trip',
  authorization: 'Basic hfyiki846vnndgx'
} as const;

const POINT_EMPTY: Point = {
  id: '',
  price: 0,
  dateFrom: new Date(),
  dateTo: dayjs().add(5, 'month').toDate(),
  destination: '',
  favorite: false,
  offers: [],
  type: TYPES[0],
};

const STATE: State = {
  id: '',
  price: 0,
  dateFrom: new Date(),
  dateTo: dayjs().add(5, 'month').toDate(),
  destination: '',
  favorite: false,
  offers: [],
  type: TYPES[0],
  isSaving: false,
  isDisabled: false,
  isDeleting: false
};

export {
  TYPES,
  MSEC_IN_DAY,
  MSEC_IN_HOUR,
  FORMAT_DURATION,
  SERVICE_OPTIONS,
  UserAction,
  UpdateType,
  FilterType,
  SortType,
  filter,
  sort,
  POINT_EMPTY,
  STATE
};
