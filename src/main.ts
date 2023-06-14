import TripInfo from './view/trip-info';
import Presenter from './presenter/presenter';
import MockService from './service/mock-service';
import {DestinationsModel, OffersModel, PointsModel} from './model';
import { render } from './framework/render';

const siteHeaderElement = document.querySelector<HTMLElement>('.trip-main');
const siteMainElement = document.querySelector<HTMLElement>('.trip-events');

const mock = new MockService();
const destinationsModel = new DestinationsModel(mock);
const offersModel = new OffersModel(mock);
const pointsModel = new PointsModel(mock);

const presenter = new Presenter({
  container: siteMainElement,
  destinationsModel,
  offersModel,
  pointsModel
});

render(siteHeaderElement, new TripInfo({
  cities: ['Moscow', 'Saint-Petersburg', 'Kazan'],
  dateFrom: new Date(2023, 4, 12),
  dateTo: new Date(2023, 4, 22),
  price: 1000,
}), 'afterbegin');

presenter.init();
