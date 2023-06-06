import MockService from "../service/mock-service";
import { Offer, OfferType } from "../types/types";

export default class OffersModel {
  #service: MockService;
  #offers: Offer[];

  constructor(service: MockService) {
    this.#service = service;
    this.#offers = this.#service.offers;
  }

  get get() {
    return this.#offers;
  }

  getByType(type: OfferType) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }
}
