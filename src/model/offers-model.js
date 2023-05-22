export default class OffersModel {
  constructor(object) {
    this.object = object;
    this.offers = this.object.getOffers();
  }

  get() {
    return this.offers;
  }

  getByType(type) {
    return this.offers
      .find((offer) => offer.type === type).offers;
  }
}
