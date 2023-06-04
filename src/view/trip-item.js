import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const TEMPLATE = '<li class="trip-events__item"></li>';

export default class ItemView extends AbstractStatefulView {
  get template() {
    return TEMPLATE;
  }
}
