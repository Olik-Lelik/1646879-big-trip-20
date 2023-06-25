import ApiService from './framework/api-service';
import { Point, PointService } from './types/types';


const enum UrlEnd {
  POINTS = 'points',
  DESTINATIONS = 'destinations',
  OFFERS = 'offers'
}

export interface ServiceProps {
  endPoint: string,
  authorization: string,
}

export default class BigTripService extends ApiService {

  constructor({endPoint, authorization}: ServiceProps) {
    super(endPoint, authorization);
  }

  get points() {
    return this._load({
      url: UrlEnd.POINTS
    })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({
      url: UrlEnd.DESTINATIONS
    })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({
      url: UrlEnd.OFFERS
    })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point: Point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point: Point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'POST',
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point: Point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'DELETE',
    });

    return response;
  }

  #adaptToServer(point: Point) {
    const adaptedPoint: Partial<Point> & PointService = {
      ...point,
      'base_price': point.price,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateFrom.toISOString() : null,
      'is_favorite': point.favorite
    };

    delete adaptedPoint.price;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.favorite;

    return adaptedPoint as PointService;
  }

}

