import {remove, render} from '../framework/render';
import SortView from '../view/trip-sort';
import ListView from '../view/trip-list';
import PointPresenter from './point-presenter';
import type {DestinationsModel, FilterModel, OffersModel, PointsModel} from '../model';
import { Point } from '../types/types';
import MessageView from '../view/message';
import { FilterType, SortType, UpdateType, UserAction, filter, sort } from '../const';
import NewPointPresenter from './new-point-presenter';

interface Props {
  container: Element;
  destinationsModel: DestinationsModel,
  offersModel: OffersModel,
  pointsModel: PointsModel,
  filterModel: FilterModel,
  onNewPointDestroy(): void
}

export default class Presenter {
  #listViewComponent = new ListView();
  #container: Element = null;
  #destinationsModel;
  #offersModel;
  #pointsModel;
  #filterModel;
  #sortComponent: SortView = null;
  #pointPresenters: Map<Point['id'], PointPresenter> = new Map();
  #currentSortType: SortType = 'day';
  #currentFilterType: FilterType = 'EVERYTHING';
  #messageComponent: MessageView = null;
  #newPointPresenter: NewPointPresenter;

  constructor({container, destinationsModel, offersModel, pointsModel, filterModel, onNewPointDestroy}: Props) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#listViewComponent.element,
      destinations: this.#destinationsModel.get,
      offers: this.#offersModel.get,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points(): Point[] {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const createFilteredPoints = filter[this.#currentFilterType](points);

    const filteredPoints = sort[this.#currentSortType](createFilteredPoints);

    return filteredPoints;
  }

  init() {
    this.#renderPointsList();
  }

  createNewPoint() {
    this.#currentSortType = 'day';
    this.#filterModel.setFilter('major', 'EVERYTHING');
    this.#newPointPresenter.init();
  }

  #handleViewAction = (userAction: UserAction, updateType: UpdateType, updatedPoint: Point) => {
    switch (userAction) {
      case 'update_point':
        this.#pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case 'add_point':
        this.#pointsModel.addPoint(updateType, updatedPoint);
        break;
      case 'delete_point':
        this.#pointsModel.deletePoint(updateType, updatedPoint);
        break;
    }
  };

  #handleModelEvent = (updateType: UpdateType, updatedPoint: Point) => {
    switch (updateType) {
      case 'patch':
        this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
        break;
      case 'minor':
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case 'major':
        this.#clearPointsList({resetSortType: true});
        this.#renderPointsList();
        break;
    }

  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter: PointPresenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType: SortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#container as HTMLElement, this.#sortComponent);
  }

  #renderMessage() {
    this.#messageComponent = new MessageView({status: 'empty', filterType: this.#currentFilterType});
    render(this.#container as HTMLElement, this.#messageComponent);
  }

  #renderPoint(point: Point) {
    const pointPresenter = new PointPresenter({
      container: this.#listViewComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointsList({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy(); //new
    this.#pointPresenters.forEach((presenter: PointPresenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = 'day';
    }

    if (this.#messageComponent) {
      remove(this.#messageComponent) ;
    }
  }

  #renderPointsList() {
    if(!this.points.length) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.points.forEach((point) => this.#renderPoint(point));
    render(this.#container as HTMLElement, this.#listViewComponent);
  }
}
