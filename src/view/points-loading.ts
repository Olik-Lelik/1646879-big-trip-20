import AbstractView from '../framework/view/abstract-view';

export default class Loading extends AbstractView {
  get template() {
    return `<p class="trip-events__msg">Loading...</p>
    `;
  }
}
