import dayjs from 'dayjs';
import { POINT_EMPTY, UpdateType, UserAction } from '../const';
import { remove, render } from '../framework/render';
import { PointsModel } from '../model';
import { Point } from '../types/types';
import FormView from '../view/trip-form';

interface NewPointForm {
  container: HTMLElement;
  pointsModel: PointsModel;
  onDataChange(
    userAction: UserAction,
    updateType: UpdateType,
    updatePoint: Point
  ): void;
  onDestroy(): void;
}

export default class NewPointPresenter {
  #container: HTMLElement | null = null;
  #pointsModel: PointsModel;
  #waypointCreationForm: FormView = null;
  #handleDataChange: (
    userAction: UserAction,
    updateType: UpdateType,
    updatePoint: Point
  ) => void;

  #handleDestroy: () => void;

  constructor({container, pointsModel, onDataChange, onDestroy}: NewPointForm) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#waypointCreationForm !== null) {
      return;
    }

    this.#waypointCreationForm = new FormView({
      point: POINT_EMPTY,
      destinations:  this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      status: 'CREATING',
      handleFormSubmit: this.#handleFormSubmit,
      handleFormReset: this.#handleFormClose,
    });

    render(this.#container, this.#waypointCreationForm, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#waypointCreationForm.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#waypointCreationForm.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false
      });
    };

    this.#waypointCreationForm.shake(resetFormState);
  }

  destroy() {
    if (this.#waypointCreationForm === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#waypointCreationForm);
    this.#waypointCreationForm = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point: Point) => {
    if (
      !point.destination || !point.dateFrom || !point.dateTo || !point.price ||
      dayjs(point.dateTo) < dayjs(point.dateFrom)
    ) {
      this.#waypointCreationForm.shake();
      return;
    }
    this.#handleDataChange('add_point', 'minor', point);
    this.destroy();
  };

  #handleFormClose = () => this.destroy();

  #escKeyDownHandler = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
