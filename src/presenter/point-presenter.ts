import { remove, render, replace } from '../framework/render';

import FormView from '../view/trip-form';
import PointView from '../view/trip-point';
import { PointsModel } from '../model';
import { Point } from '../types/types.js';
import { UpdateType, UserAction } from '../const';

interface Model {
  container: HTMLElement;
  pointsModel: PointsModel;
  onDataChange(
    userAction: UserAction,
    updateType: UpdateType,
    updatePoint: Point
  ): void;
  onModeChange(): void;
}

const enum Mode {
  DEFAULT = 'DEFAULT',
  EDITING = 'EDITING',
}
export default class PointPresenter {
  #container: HTMLElement;
  #pointsModel: PointsModel;
  #itemView: PointView | null = null;
  #itemEditView: FormView | null = null;
  #point: Point | null = null;
  #mode = Mode.DEFAULT;
  #pointChangeHandler: (
    userAction: UserAction,
    updateType: UpdateType,
    updatePoint: Point
  ) => void;

  #modeChangeHandler: () => void;

  constructor({ container, pointsModel, onDataChange, onModeChange }: Model) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#pointChangeHandler = onDataChange;
    this.#modeChangeHandler = onModeChange;
  }

  init(point: Point) {
    this.#point = point;

    const prevItemView = this.#itemView;
    const prevEditView = this.#itemEditView;

    this.#itemView = new PointView({
      point,
      currentDestination: this.#pointsModel.getById(point.destination),
      currentOffers: this.#pointsModel.getByType(point.type),
      onEditClick: this.#replacePointToEdit,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#itemEditView = new FormView({
      point,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      status: 'EDITING',
      onFormSubmit: this.#handleFormSubmit,
      onToggleClick: this.#replaceEditToPoint,
      onFormReset: this.#handlePointDelete,
    });

    if (prevItemView === null || prevEditView === null) {
      return render(this.#container, this.#itemView);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#itemView, prevItemView);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#itemEditView, prevEditView);
    }

    remove(prevItemView);
    remove(prevEditView);
  }

  destroy() {
    remove(this.#itemView);
    remove(this.#itemEditView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#itemEditView?.reset(this.#point);
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit = () => {
    replace(this.#itemEditView, this.#itemView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#modeChangeHandler();
    this.#mode = Mode.EDITING;
  };

  #replaceEditToPoint = () => {
    replace(this.#itemView, this.#itemEditView);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#itemEditView?.reset(this.#point);
      this.#replaceEditToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    this.#pointChangeHandler('update_point', 'patch', {
      ...this.#point,
      favorite: !this.#point.favorite,
    });
  };

  #handleFormSubmit = (updatePoint: Point) => {
    this.#pointChangeHandler('update_point', 'minor', updatePoint);
    this.#replaceEditToPoint();
  };

  #handlePointDelete = (point: Point) => {
    this.#pointChangeHandler('delete_point', 'minor', point);
  };
}
