import {render} from '../framework/render';
import FiltersView from '../view/trip-filters';
import SortView from '../view/trip-sort';
import ListView from '../view/trip-list';
import PointPresenter from './point';
import {DestinationsModel, OffersModel, PointsModel} from '../model';
import { generateFilter } from '../mock/filter';
import { Point } from '../types/types';
import MessageView from '../view/message';
import { updatePoint } from '../utils';
import { SortType, sort } from '../const';

interface Props {
  container: Element;
  destinationsModel: DestinationsModel,
  offersModel: OffersModel,
  pointsModel: PointsModel
}
export default class Presenter {
  #listViewElement = new ListView();
  #controlsFiltersElement = document.querySelector<HTMLDivElement>('.trip-controls__filters');
  #container;
  #destinationsModel;
  #offersModel;
  #pointsModel;
  #points: Point[];
  #pointPresenters: Map<Point['id'], PointPresenter> = new Map();
  #sortComponent: SortView = null;
  #currentSortType: SortType = 'day';

  constructor({container, destinationsModel, offersModel, pointsModel}: Props) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = sort[this.#currentSortType](this.#pointsModel.get);
    this.#renderPage();
  }

  #renderPoint(point: Point) {
    const pointPresenter = new PointPresenter({
      container: this.#listViewElement.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handlerModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderPointsList() {
    render(this.#container as HTMLElement, this.#listViewElement);
    this.#renderPoints();
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter: PointPresenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint: Point) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handlerModeChange = () => {
    this.#pointPresenters.forEach((presenter: PointPresenter) => presenter.resetView());
  };

  #sortPoints(sortType: SortType) {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#points);
  }

  #handleSortTypeChange = (sortType: SortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  };

  #renderSort() {
    const sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#container as HTMLElement, sortComponent);
  }

  #renderFilters() {
    render(this.#controlsFiltersElement, new FiltersView(generateFilter(this.#points)));
  }

  #renderMessageEverything() {
    render(this.#container as HTMLElement, new MessageView({status: 'empty', chosenFilter: 'EVERYTHING'}));
  }

  // #renderMessageFuture() {
  //   render(this.#container as HTMLElement, new MessageView({status: 'empty', chosenFilter: 'FUTURE'}));
  // }
  // #renderMessagePast() {
  //   render(this.#container as HTMLElement, new MessageView({status: 'empty', chosenFilter: 'PAST'}));
  // }
  // #renderMessagePresent() {
  //   render(this.#container as HTMLElement, new MessageView({status: 'empty', chosenFilter: 'PRESENT'}));
  // }
  #renderPage() {
    if(!this.#points.length) {
      this.#renderMessageEverything();
      return;
    }
    this.#renderFilters();
    this.#renderSort();
    this.#renderPointsList();
  }
}
