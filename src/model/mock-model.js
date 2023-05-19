import { getRandom, getRandomArrayElement } from '../utils.js';
import { VALUE, TYPES } from '../const.js';
import { createPoint } from '../mock/point.js';
import { createDestination } from '../mock/destination.js';
import { createOffers } from '../mock/offer.js';

export default class MockModel {
  destinations = [];
  offers = [];
  points = [];

  constructor() {
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.points = this.generatePoints();
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getPoints() {
    return this.points;
  }

  generateDestinations() {
    return Array.from({length: VALUE}, createDestination);
  }

  generateOffers() {
    return TYPES.map((type) => createOffers(type));
  }

  generatePoints() {
    return Array.from({length: VALUE}, () => {
      const type = getRandomArrayElement(TYPES);
      const destination = getRandomArrayElement(this.destinations);

      const hasOffers = getRandom(0, 1);
      const offersByType = this.offers.find((offer) => offer.type === type);

      const offerIds = (hasOffers) ? offersByType.offers
        .map((offer) => offer.id) : [];

      return createPoint(type, destination.id, offerIds);
    });
  }
}
