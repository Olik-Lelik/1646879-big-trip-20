import { UpdateType } from '../const';
import Observable from '../framework/observable';
import MockService from '../service/mock-service';
import { Point } from '../types/types';

export default class PointsModel extends Observable {
  #service: MockService;
  #points: Point[];

  constructor(service: MockService) {
    super();
    this.#service = service;
    this.#points = this.#service.points;
  }

  get points() {
    return this.#points;
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

    this._notify(updateType, updatedPoint);
  }
}
