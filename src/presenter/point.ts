import {render, replace} from '../framework/render.js';

import FormView from '../view/trip-form';
import PointView from '../view/trip-point';
import {DestinationsModel, OffersModel, PointsModel} from '../model';
import { Point } from '../types/types.js';

interface Model {
  container: Element,
  destinationsModel: DestinationsModel,
  offersModel :OffersModel,
  pointsModel: PointsModel
}

export default class PointPresenter {
  #container;
  #destinations: DestinationsModel;
  #offers: OffersModel;
  #points: Point[];

  constructor({container, destinationsModel, offersModel, pointsModel}: Model) {
    this.#container = container;
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#points = [...pointsModel.get];

    this.#points.forEach((point) => this.#renderItemView(point));
  }

  #renderItemView(point: Point) {
    const itemView = new PointView({
      point,
      pointDestination: this.#destinations.getById(point.destination),
      pointOffers: this.#offers.getByType(point.type),
      onEditClick: editClickHandler
    })

    const itemEditView = new FormView({
      point,
      pointDestinations: this.#destinations.get,
      getOffers: ({type}: Point) => this.#offers.getByType(type),
      getDestination: ({destination}: Point) => this.#destinations.getById(destination),
      onRollupClick: buttonRollupHandler,
      onFormSubmit: formSubmitHandler
    })

    const replacePointToEdit = () => replace(itemEditView, itemView);

    const replaceEditToPoint = () => replace(itemView, itemEditView);

    const escKeyDownHandler = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler)
      }
    }

    function editClickHandler() {
      replacePointToEdit();
      document.addEventListener('keydown', escKeyDownHandler)
    }

    function formSubmitHandler() {
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler)
    }

    function buttonRollupHandler() {
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler)
    }

    render(this.#container as HTMLElement, itemView)
  }

}
