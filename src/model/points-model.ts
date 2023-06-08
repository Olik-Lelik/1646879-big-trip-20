import MockService from '../service/mock-service';
import { Point } from '../types/types';

export default class PointsModel {
  #service: MockService;
  #points: Point[];

  constructor(service: MockService) {
    this.#service = service;
    this.#points = this.#service.points;
  }

  get get() {
    return this.#points;
  }
}
