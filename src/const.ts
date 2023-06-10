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
  'Rome'
]  as const;

const DESCRIPTION = 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const MSEC_IN_HOUR = 3600000;
const MSEC_IN_DAY = 86400000;

const FORMAT_DURATION = {
  'mm': 'mm[M]',
  'HHmm': 'HH[H] mm[M]',
  'DDHHmm': 'DD[D] HH[H] mm[M]'
} as const;

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
} as const;

export {VALUE, TYPES, CITIES, DESCRIPTION, MSEC_IN_DAY, MSEC_IN_HOUR, FORMAT_DURATION, FilterType};
