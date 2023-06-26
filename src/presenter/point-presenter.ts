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

  #handleModeChange: () => void;

  constructor({ container, pointsModel, onDataChange, onModeChange }: Model) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#pointChangeHandler = onDataChange;
    this.#handleModeChange = onModeChange;
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
      onFavoriteClick: this.#handleFavoriteClick,
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
      this.#mode = Mode.DEFAULT;
    }

    remove(prevItemView);
    remove(prevEditView);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#itemEditView.updateElement({
        isSaving: true,
        isDisabled: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#itemEditView.updateElement({
        isDeleting: true,
        isDisabled: true
      });
    }
  }

  setAborting() {
    if(this.#mode === Mode.DEFAULT) {
      return this.#itemView.shake();
    }

    const resetFormState = () => {
      this.#itemEditView.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false
      });
    };

    this.#itemEditView.shake(resetFormState);
  }

  destroy() {
    remove(this.#itemView);
    remove(this.#itemEditView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#itemEditView.reset(this.#point);
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit = () => {
    replace(this.#itemEditView, this.#itemView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
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

  #handleFavoriteClick = () => {
    this.#pointChangeHandler('update_point', 'patch', {
      ...this.#point,
      favorite: !this.#point.favorite,
    });
  };

  onSuccessSaving = () => this.#replaceEditToPoint();

  #handleFormSubmit = (updatePoint: Point) => {
    this.#pointChangeHandler('update_point', 'minor', updatePoint);
  };

  #handlePointDelete = (point: Point) => {
    this.#pointChangeHandler('delete_point', 'minor', point);
  };
}
