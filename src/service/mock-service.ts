import { getRandomArrayElement } from '../utils';
import { VALUE, TYPES } from '../const';
import { createPoint } from '../mock/point';
import { createDestination } from '../mock/destination';
import { createOffers } from '../mock/offer';
import { Destination, Offer, Point } from '../types/types';

export default class MockService {
  #destinations: Destination[];
  #offers: Offer[];
  #points: Point[];

  constructor() {
    this.#destinations = this.generateDestinations;
    this.#offers = this.generateOffers;
    this.#points = this.generatePoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  get generateDestinations() {
    return Array.from({length: VALUE}, createDestination);
  }

  get generateOffers() {
    return TYPES.map(createOffers);
  }

  get generatePoints() {
    return Array.from({length: VALUE}, () => {
      const type = getRandomArrayElement(TYPES);
      const destination = getRandomArrayElement(this.#destinations);

      const {offers} = this.#offers.find((offer) => offer.type === type);

      const offerIds = offers.length > 0 ? offers
        .map(({id}) => id) : [];

      return createPoint(type, destination.id, offerIds);
    });
  }
}
