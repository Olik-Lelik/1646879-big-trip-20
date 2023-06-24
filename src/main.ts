import TripInfo from './view/trip-info';
import Presenter from './presenter/presenter';
import {FilterModel, PointsModel} from './model';
import { render } from './framework/render';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButton from './view/new-button';
import PointsApiService from './view/points-api-service';

const siteHeaderElement = document.querySelector<HTMLElement>('.trip-main');
const siteMainElement = document.querySelector<HTMLElement>('.trip-events');

const AUTHORIZATION = 'Basic hfyiki846vnndh' as const;
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip' as const;

const pointsModel = new PointsModel({
  service: new PointsApiService({
    endPoint: END_POINT,
    authorization: AUTHORIZATION,
  })
});

const filterModel = new FilterModel();

const presenter = new Presenter({
  container: siteMainElement,
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

pointsModel.init();

filterPresenter.init();
presenter.init();
