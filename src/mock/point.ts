import { OfferType, Point } from '../types/types';
import { getBoolean, getDateFrom, getDateTo, getRandom } from '../utils';

const enum Price {
  Min = 1000,
  Max = 2000
}

export const createPoint = (type: OfferType, destination: string, offers: Array<string>): Point => {
  const dateFrom = getDateFrom();
  const dateTo = getDateTo(dateFrom);

  return {
  id: crypto.randomUUID(),
  price: getRandom(Price.Min, Price.Max),
  dateFrom,
  dateTo,
  destination,
  favorite: getBoolean(),
  offers,
  type
  }
}
