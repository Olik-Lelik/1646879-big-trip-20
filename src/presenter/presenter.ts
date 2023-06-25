import {remove, render} from '../framework/render';
import SortView from '../view/trip-sort';
import ListView from '../view/trip-list';
import PointPresenter from './point-presenter';
import type {FilterModel, PointsModel} from '../model';
import { Point } from '../types/types';
import MessageView from '../view/message';
import { FilterType, SortType, UpdateType, UserAction, filter, sort } from '../const';
import NewPointPresenter from './new-point-presenter';
import Loading from '../view/points-loading';

interface Props {
  container: Element;
  pointsModel: PointsModel,
  filterModel: FilterModel,
  onNewPointDestroy(): void
}

export default class Presenter {
  #listViewComponent = new ListView();
  #loadingComponent = new Loading();
  #container: Element | null = null;
  #pointsModel: PointsModel;
  #filterModel: FilterModel;
  #sortComponent: SortView | null = null;
  #pointPresenters: Map<Point['id'], PointPresenter> = new Map();
  #currentSortType: SortType = 'day';
  #currentFilterType: FilterType = 'EVERYTHING';
  #messageComponent: MessageView | null = null;
  #newPointPresenter: NewPointPresenter;
  #isLoading = true;

  constructor({container, pointsModel, filterModel, onNewPointDestroy}: Props) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#listViewComponent.element,
      pointsModel: this.#pointsModel,
      // destinations: this.#pointsModel.destinations,
      // offers: this.#pointsModel.offers,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
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

  #renderLoadingComponent() {
    render(this.#listViewComponent.element, this.#loadingComponent);
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
        this.#pointPresenters.get(updatedPoint.id)?.init(updatedPoint);
        break;
      case 'minor':
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case 'major':
        this.#clearPointsList({resetSortType: true});
        this.#renderPointsList();
        break;
      case 'init':
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
      pointsModel: this.#pointsModel,
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
    // remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = 'day';
    }

    if (this.#messageComponent) {
      remove(this.#messageComponent) ;
    }
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
    render(this.#container as HTMLElement, this.#listViewComponent);

  }

  #renderPointsList() {
    render(this.#container as HTMLElement, this.#listViewComponent);


    if(this.#isLoading) {
      return this.#renderLoadingComponent();
    }

    if(!this.points.length) {
      return this.#renderMessage();
    }


    this.#renderSort();
    this.#renderPoints();
  }
}
