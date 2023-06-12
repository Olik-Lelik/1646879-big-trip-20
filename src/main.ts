import TripInfo from './view/trip-info';
import Presenter from './presenter/presenter';
import MockService from './service/mock-service';
import {DestinationsModel, OffersModel, PointsModel} from './model';
import { RenderPosition, render } from './framework/render.js';

const siteHeaderElement = document.querySelector<HTMLElement>('.trip-main');
const siteMainElement = document.querySelector<HTMLElement>('.trip-events');

const mock = new MockService();
const destinationsModel = new DestinationsModel(mock);
const offersModel = new OffersModel(mock);
const pointsModel = new PointsModel(mock);

const presenter = new Presenter({
  container: siteMainElement,
});

render(siteHeaderElement, new TripInfo({
  cities: ['Moscow', 'Saint-Petersburg', 'Kazan'],
  dateFrom: new Date(2023, 4, 12),
  dateTo: new Date(2023, 4, 22),
  price: 1000,
}), RenderPosition.AFTERBEGIN);

presenter.init({
  destinationsModel,
  offersModel,
  pointsModel
});
