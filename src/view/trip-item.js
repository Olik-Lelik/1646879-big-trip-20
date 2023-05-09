import {createElement} from '../render.js';

const TEMPLATE = '<li class="trip-events__item"></li>';

export default class ItemView {
  getTemplate() {
    return TEMPLATE;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
