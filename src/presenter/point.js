import {render} from '../render.js';

import FormView from '../view/trip-form.js';
import PointView from '../view/trip-point.js';
import ItemView from '../view/trip-item.js';

const NUMBER_ITEM = 3;

export default class PointPresenter {
  itemView = new ItemView(); // li

  /**
   *
   * @param {} tripItem — data of trip point to render
   * @param {Element} container
   */
  constructor(container) {
    render(container, this.itemView);
    this.updateFormView();
    for(let i = 1; i <= NUMBER_ITEM; i++) {
      this.updateItemView();
    }
  }

  updateItemView() {
    return render(this.itemView.getElement(), new PointView());
  }

  updateFormView() {
    return render(this.itemView.getElement(), new FormView());
  }
}
