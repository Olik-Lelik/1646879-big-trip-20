import {RenderPosition, render} from './render.js';
import TripInfo from './view/trip-info.js';
import Presenter from './presenter/presenter.js';
import MockModel from './model/mock-model.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');

const mock = new MockModel();
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
