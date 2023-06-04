import { getRandomArrayElement, getBoolean } from '../utils';
import { VALUE, TYPES } from '../const';
import { createPoint } from '../mock/point';
import { createDestination } from '../mock/destination';
import { createOffers } from '../mock/offer';
import { Destination, Offer, Point } from '../types/types';

export default class MockService {
  #destinations: Destination[] = [];
  #offers: Offer[] = [];
  #points: Point[] = [];

  constructor() {
    this.#destinations = this.generateDestinations();
    this.#offers = this.generateOffers();
    this.#points = this.generatePoints();
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }

  getPoints() {
    return this.#points;
  }

  generateDestinations() {
    return Array.from({length: VALUE}, createDestination);
  }

  generateOffers() {
    return TYPES.map(createOffers);
  }

  generatePoints() {
    return Array.from({length: VALUE}, () => {
      const type = getRandomArrayElement(TYPES);
      const destination = getRandomArrayElement(this.#destinations);

      const {offers} = this.#offers.find((offer) => offer.type === type);

      const offerIds = offers ? offers
        .map(({id}) => id) : [];

      return createPoint(type, destination.id, offerIds);
    });
  }
}
