import {render} from '../framework/render.js';
import FiltersView from '../view/trip-filters';
import SortView from '../view/trip-sort';
import ListView from '../view/trip-list';
import PointPresenter from './point';
import {DestinationsModel, OffersModel, PointsModel} from '../model';
import { generateFilter } from '../mock/filter.js';

interface Props {
  container: Element;
};

interface Model {
  destinationsModel: DestinationsModel,
  offersModel :OffersModel,
  pointsModel: PointsModel
}

export default class Presenter {
  #tripListComponent = new ListView();
  #container;
  #controlsFiltersElement;

  constructor({container}: Props) {
    this.#container = container;
    this.#controlsFiltersElement = document.querySelector<HTMLDivElement>('.trip-controls__filters');
  }

  init({destinationsModel, offersModel, pointsModel}: Model) {
    render(this.#controlsFiltersElement, new FiltersView(generateFilter(pointsModel.get)));
    render(this.#container as HTMLElement, new SortView());
    render(this.#container as HTMLElement, this.#tripListComponent);

    new PointPresenter({
      container: this.#tripListComponent.element,
      destinationsModel,
      offersModel,
      pointsModel,
    });

  }
}
