import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FORMAT_DURATION, MSEC_IN_DAY, MSEC_IN_HOUR } from './const';
import { Point } from './types/types';
dayjs.extend(duration);

const enum Duration {
  Day = 2,
  Hour = 5,
  Min = 59,
}

/**
 * Функция, возвращающая случайное целое число из переданного диапазона включительно.
 * @param min - меньше чем max
 * @param max
 */
function getRandom(min: number, max: number): number {
  if (min >= max) {
    throw new Error('Диапазон включает только положительные числа. Число "от" не может быть больше или равно числу "до".');
  }

  min = Math.ceil(min);
  max = Math.floor(max);

  const random = min + Math.random() * (max - min + 1);
  return Math.floor(random);
}

const getRandomArrayElement = <Element>(elements: Element[] | readonly Element[]) => elements[getRandom(0, elements.length - 1)];

const getBoolean = () => Boolean(getRandom(0, 1));

const getDateFrom = () => dayjs()
  .subtract(getRandom(0, Duration.Day), 'd')
  .subtract(getRandom(0, Duration.Hour), 'h')
  .subtract(getRandom(0, Duration.Min), 'm').toDate();

const getDateTo = (date: Date) => dayjs(date)
  .add(getRandom(0, Duration.Day), 'd')
  .add(getRandom(0, Duration.Hour), 'h')
  .add(getRandom(0, Duration.Min), 'm').toDate();

function getDateDuration(dateTo: Date, dateFrom: Date) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  let pointDuration = '0';

  if (timeDiff >= MSEC_IN_DAY) {
    pointDuration = dayjs.duration(timeDiff).format(FORMAT_DURATION['DDHHmm']);
  } else if (timeDiff >= MSEC_IN_HOUR) {
    pointDuration = dayjs.duration(timeDiff).format(FORMAT_DURATION['HHmm']);
  } else if (timeDiff < MSEC_IN_HOUR) {
    pointDuration = dayjs.duration(timeDiff).format(FORMAT_DURATION['mm']);
  }

  return pointDuration;
}

function formatStringToDateTime(date: Date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

function formatStringToShortDateTime(date: Date) {
  return dayjs(date).format('YYYY-MM-DD');
}

function formatStringToHumanizeDateTime(date: Date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToTime(date: Date) {
  return dayjs(date).format('HH:mm');
}

function isPointFuture(point: Point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPast(point: Point) {
  return dayjs().isAfter(point.dateTo);
}

function isPointPresent(point: Point) {
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}


export {
  getRandom,
  getRandomArrayElement,
  getBoolean,
  getDateFrom,
  getDateTo,
  getDateDuration,
  formatStringToDateTime,
  formatStringToShortDateTime,
  formatStringToHumanizeDateTime,
  formatStringToTime,
  isPointFuture,
  isPointPresent,
  isPointPast
};
