import {remove, render, replace} from '../framework/render';

import FormView from '../view/trip-form';
import PointView from '../view/trip-point';
import {DestinationsModel, OffersModel} from '../model';
import { Point } from '../types/types.js';

interface Model {
  container: HTMLElement,
  destinationsModel: DestinationsModel,
  offersModel: OffersModel,
  onDataChange(updatedPoint: Point): void,
  onModeChange(): void,
}

const enum Mode {
  DEFAULT='DEFAULT',
  EDITING='EDITING',
}
export default class PointPresenter {
  #container: HTMLElement;
  #destinations: DestinationsModel;
  #offers: OffersModel;
  #itemView: PointView | null = null;
  #itemEditView: FormView | null = null;
  #point: Point = null;
  #mode = Mode.DEFAULT;
  #pointChangeHandler: (updatedPoint: Point) => void;
  #modeChangeHandler: () => void;

  constructor({container, destinationsModel, offersModel, onDataChange, onModeChange}: Model) {
    this.#container = container;
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#pointChangeHandler = onDataChange;
    this.#modeChangeHandler = onModeChange;
  }

  init(point: Point) {
    this.#point = point;

    const prevItemView = this.#itemView;
    const prevEditView = this.#itemEditView;

    this.#itemView = new PointView({
      point,
      currentDestination: this.#destinations.getById(point.destination),
      currentOffers: this.#offers.getByType(point.type),
      onEditClick: this.#replacePointToEdit,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#itemEditView = new FormView({
      point,
      destinations: this.#destinations.get,
      currentOffers: this.#offers.getByType(point.type),
      getCurrentDestination: ({destination}: Point) => this.#destinations.getById(destination),
      onRollupClick: this.#replaceEditToPoint,
      onFormSubmit: this.#formSubmitHandler
    });

    if(prevItemView === null || prevEditView === null) {
      return render(this.#container, this.#itemView);
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#itemView, prevItemView);
    }

    if(this.#mode === Mode.EDITING) {
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
    if(this.#mode !== Mode.DEFAULT) {
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit = () => {
    replace(this.#itemEditView, this.#itemView);
    document.addEventListener('keydown',this.#escKeyDownHandler);
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
      this.#replaceEditToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #formSubmitHandler = (point: Point) => {
    this.#pointChangeHandler(point);
    this.#replaceEditToPoint();
  };

  #favoriteClickHandler = () => {
    this.#pointChangeHandler({
      ...this.#point,
      favorite: !this.#point.favorite
    });
  };
}
