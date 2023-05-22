import {render} from '../render.js';

import FormView from '../view/trip-form.js';
import PointView from '../view/trip-point';
import ItemView from '../view/trip-item.js';

// const NUMBER_ITEM = 3;

export default class PointPresenter {
  itemView = new ItemView(); // li

  /**
   *
   * @param {} tripItem — data of trip point to render
   * @param {Element} container
   */
  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.container = container;
    this.destinations = destinationsModel;
    this.offers = offersModel;
    this.points = [...pointsModel.get()];

    render(this.container, this.itemView);
    this.updateFormView();

    this.updateItemView();
  }

  updateItemView() {
    return this.points.forEach((point) => render(
      this.itemView.getElement(),
      new PointView({
        point,
        pointDestination: this.destinations.getById(point.destination),
        pointOffers: this.offers.getByType(point.type)
      })
    ));
  }

  updateFormView() {
    return render(
      this.itemView.getElement(),
      new FormView({
        point: this.points[0],
        pointDestinations: this.destinations.get(),
        pointOffers: this.offers.get()
      })
    );
  }
}
