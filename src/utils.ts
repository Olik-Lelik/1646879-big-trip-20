import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FORMAT_DURATION, MSEC_IN_DAY, MSEC_IN_HOUR } from './const';
import { Point } from './types/types';
dayjs.extend(duration);

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

function updatePoint(points: Point[], update: Point) {
  return points.map((point) => point.id === update.id ? update : point);
}

function getDayDifference(pointA: Point, pointB: Point) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function getTimeDifference(pointA: Point, pointB: Point) {
  const timeDiffA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeDiffB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return timeDiffB - timeDiffA;
}

function getPriceDifference(pointA: Point, pointB: Point) {
  return pointB.price - pointA.price;
}

export {
  getDateDuration,
  formatStringToDateTime,
  formatStringToShortDateTime,
  formatStringToHumanizeDateTime,
  formatStringToTime,
  isPointFuture,
  isPointPresent,
  isPointPast,
  updatePoint,
  getDayDifference,
  getTimeDifference,
  getPriceDifference,
  dayjs
};
