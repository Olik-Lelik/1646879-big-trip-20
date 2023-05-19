export default class DestinationsModel {
  constructor(object) {
    this.object = object;
    this.destinations = this.object.getDestinations();
  }

  get() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations
      .find((destination) => destination.id === id);
  }
}
