import { getRandom } from '../utils.js';
import { VALUE } from '../const.js';

const createOffersList = (type) => {
  const price = getRandom(50, 80);

  return {
    id: crypto.randomUUID(),
    title: type,
    price: `${price}`
  };
};

const createOffers = (type) => ({
  type,
  offers: Array.from({length: getRandom(0, VALUE)}, () => createOffersList(type))
});

export {createOffers};
