import { UpdateType } from '../const';
import Observable from '../framework/observable';
import { Destination, Offer, Point, PointService } from '../types/types';
import BigTripService from '../service';

interface Service {
  service: BigTripService
}
export default class PointsModel extends Observable {
  #service: BigTripService | null = null;
  #points: Point[] = [];
  #destinations: Destination[] = [];
  #offers: Offer[] = [];

  constructor({service}: Service) {
    super();
    this.#service = service;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getById(id: Destination['id']) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }

  getByType(type: Offer['type']) {
    return this.#offers
      .find((offer) => offer.type === type)?.offers || [];
  }

  async init() {
    try {
      const points = await this.#service.points;
      this.#points = points.map(this.#adaptToClient);
      const destinations = await this.#service.destinations;
      this.#destinations = destinations;
      const offers = await this.#service.offers;
      this.#offers = offers;
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType: UpdateType, updatedPoint: Point) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#service.updatePoint(updatedPoint);
      const newUpdatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        newUpdatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, newUpdatedPoint);
    } catch(err) {
      throw new Error('Can\'t update unexisting point');
    }
  }

  async addPoint(updateType: UpdateType, updatedPoint: Point) {
    try {
      await this.#service.addPoint(updatedPoint);
      this.#points = [
        updatedPoint,
        ...this.#points
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType: UpdateType, updatedPoint: Point) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    try {
      await this.#service.deletePoint(updatedPoint);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point: PointService) {
    const adaptedPoint: Partial<PointService> & Point = {
      ...point,
      price: point['base_price'],
      dateFrom: point['date_from'] ? new Date(point['date_from']) : new Date(),
      dateTo: point['date_to'] ? new Date(point['date_to']) : new Date(),
      favorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint as Point;
  }
}
