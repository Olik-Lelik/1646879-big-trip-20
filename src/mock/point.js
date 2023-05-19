import { getRandom } from '../utils.js';
import { nanoid } from 'nanoid';

const MIN_PRICE_VALUE = 1000;
const MAX_PRICE_VALUE = 2000;

const createPoint = (type, destinationId, offersId) => ({
  id: nanoid(),
  price: getRandom(MIN_PRICE_VALUE, MAX_PRICE_VALUE),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: destinationId,
  favorite: getRandom(0, 1),
  offers: offersId,
  type
});

export {createPoint};
