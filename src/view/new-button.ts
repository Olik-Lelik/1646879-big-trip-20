import AbstractView from '../framework/view/abstract-view';

interface Button {
  onClick(): void;
}

export default class NewPointButton extends AbstractView {
  #handleClick: () => void | null;

  constructor({onClick}: Button) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
    `;
  }

  #clickHandler = (evt: Event) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
