import TripInfo from './view/trip-info.js';
import Presenter from './presenter/presenter.js';
import MockService from './service/mock-model.js';
import DestinationsModel from './model/destination-model';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import { RenderPosition, render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');

const mock = new MockService();
const destinationsModel = new DestinationsModel(mock);
const offersModel = new OffersModel(mock);
const pointsModel = new PointsModel(mock);

const presenter = new Presenter({
  container: siteMainElement,
  // destinationsModel,
  // offersModel,
  // pointsModel
});

render(siteHeaderElement, new TripInfo, RenderPosition.AFTERBEGIN);

presenter.init({
  destinationsModel,
  offersModel,
  pointsModel
});
