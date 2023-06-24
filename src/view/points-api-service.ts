import ApiService from '../framework/api-service';
import { Point } from '../types/types';

const Method = {
  GET: 'GET',
  PUT: 'PUT'
} as const;

const UrlEnd = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers'
};

interface Service {
  endPoint: string,
  authorization: string,
  // urlType: UrlType
}

export default class PointsApiService extends ApiService {
  // #urlType: UrlType;

  constructor({endPoint, authorization}: Service) {
    super(endPoint, authorization);
    // this.#urlType = urlType;
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
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToService(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToService(point: Point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.price,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString : null,
      'date_to': point.dateTo instanceof Date ? point.dateFrom.toISOString : null,
      'is_favorite': point.favorite
    };

    delete adaptedPoint.price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.favorite;

    return adaptedPoint;
  }

}

