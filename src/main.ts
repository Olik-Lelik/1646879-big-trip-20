import TripInfo from './view/trip-info';
import Presenter from './presenter/presenter';
import {FilterModel, PointsModel} from './model';
import { render } from './framework/render';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButton from './view/new-button';
import BigTripService from './service';
import { SERVICE_OPTIONS } from './const';

const siteHeaderElement = document.querySelector<HTMLElement>('.trip-main');
const siteMainElement = document.querySelector<HTMLElement>('.trip-events');
const filtersContainerElement = document.querySelector<HTMLElement>('.trip-controls__filters');

if (!siteMainElement || !siteHeaderElement || !filtersContainerElement) {
  throw new Error('Important site elements were not found on the page. Correct site work is not garanteed.');
}

const pointsModel = new PointsModel({
  service: new BigTripService(SERVICE_OPTIONS)
});

const filterModel = new FilterModel();

const presenter = new Presenter({
  container: siteMainElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  container: filtersContainerElement,
  pointsModel,
  filterModel,
});

const newPointButtonComponent = new NewPointButton({
  onClick: handleNewPointFormOpen
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointFormOpen() {
  presenter.createNewPoint();
  newPointButtonComponent.element.disabled = true;
}

render(siteHeaderElement, new TripInfo({
  cities: ['Moscow', 'Saint-Petersburg', 'Kazan'],
  dateFrom: new Date(2023, 4, 12),
  dateTo: new Date(2023, 4, 22),
  price: 1000,
}), 'afterbegin');

filterPresenter.init();
presenter.init();
pointsModel.init()
  .finally(() => {
    render(siteHeaderElement, newPointButtonComponent);
  });

