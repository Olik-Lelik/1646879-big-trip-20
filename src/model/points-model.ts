import { UpdateType } from '../const';
import Observable from '../framework/observable';
import { Destination, Offer, OfferType, Point, PointService } from '../types/types';
import PointsApiService from '../view/points-api-service';

interface Service {
  service: PointsApiService
}
export default class PointsModel extends Observable {
  #service: PointsApiService;
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

  getByType(type: OfferType) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
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

  updatePoint(updateType: UpdateType, updatedPoint: Point) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType: UpdateType, updatedPoint: Point) {
    this.#points = [
      updatedPoint,
      ...this.#points
    ];

    this._notify(updateType, updatedPoint);
  }

  deletePoint(updateType: UpdateType, updatedPoint: Point) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  #adaptToClient(point: PointService) {
    const adaptedPoint = {
      ...point,
      price: point.base_price,
      dateFrom: point.date_from !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point.date_to !== null ? new Date(point['date_to']) : point['date_to'],
      favorite: point.is_favorite
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
