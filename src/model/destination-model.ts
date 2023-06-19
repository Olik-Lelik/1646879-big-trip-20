import MockService from '../service/mock-service';
import { Destination } from '../types/types';

export default class DestinationsModel {
  #service: MockService;
  #destinations: Destination[];

  constructor(service: MockService) {
    this.#service = service;
    this.#destinations = this.#service.destinations;
  }

  get get() {
    return this.#destinations;
  }

  getById(id: Destination['id']) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }

  getByCity(city: Destination['name']) {
    return this.#destinations
      .find((destination) => destination.name === city);
  }
}
