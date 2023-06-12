import { getRandom } from '../utils';
import { VALUE } from '../const';
import { OfferType, OfferItem } from '../types/types';

const Price = {
  Min: 50,
  Max: 80
} as const;

const mockOfferItem = (type: OfferType): OfferItem => {
  const price = getRandom(Price.Min, Price.Max);

  return {
    id: crypto.randomUUID(),
    title: `Offer of ${type}`,
    price
  };
};

export const createOffers = (type: OfferType) => ({
  type,
  offers: Array.from({length: getRandom(0, VALUE)}, () => mockOfferItem(type))
});
