import TripInfo from './view/trip-info.js';
import Presenter from './presenter/presenter';
import MockService from './service/mock-service';
import {DestinationsModel, OffersModel, PointsModel} from './model';
import { RenderPosition, render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');

const mock = new MockService();
const destinationsModel = new DestinationsModel(mock);
const offersModel = new OffersModel(mock);
const pointsModel = new PointsModel(mock);

const presenter = new Presenter({
  container: siteMainElement,
});

render(siteHeaderElement, new TripInfo, RenderPosition.AFTERBEGIN);

presenter.init({
  destinationsModel,
  offersModel,
  pointsModel
});
