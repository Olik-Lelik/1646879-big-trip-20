import AbstractView from '../framework/view/abstract-view';

const TEMPLATE = '<ul class="trip-events__list"></ul>';

export default class ListView extends AbstractView {
  get template() {
    return TEMPLATE;
  }
}
