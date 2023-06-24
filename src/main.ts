import TripInfo from './view/trip-info';
import Presenter from './presenter/presenter';
import MockService from './service/mock-service';
import {DestinationsModel, FilterModel, OffersModel, PointsModel} from './model';
import { render } from './framework/render';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButton from './view/new-button';

const siteHeaderElement = document.querySelector<HTMLElement>('.trip-main');
const siteMainElement = document.querySelector<HTMLElement>('.trip-events');

const mock = new MockService();
const destinationsModel = new DestinationsModel(mock);
const offersModel = new OffersModel(mock);
const pointsModel = new PointsModel(mock);
const filterModel = new FilterModel();

const presenter = new Presenter({
  container: siteMainElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  container: siteHeaderElement,
  pointsModel,
  filterModel,
});

const newPointButtonComponent = new NewPointButton({
  onClick: handleNewPointFormOpen
});

function handleNewPointFormClose() {
  (newPointButtonComponent.element as HTMLButtonElement).disabled = false;
}

function handleNewPointFormOpen() {
  presenter.createNewPoint();
  (newPointButtonComponent.element as HTMLButtonElement).disabled = true;
}

render(siteHeaderElement, newPointButtonComponent);

render(siteHeaderElement, new TripInfo({
  cities: ['Moscow', 'Saint-Petersburg', 'Kazan'],
  dateFrom: new Date(2023, 4, 12),
  dateTo: new Date(2023, 4, 22),
  price: 1000,
}), 'afterbegin');

filterPresenter.init();
presenter.init();
