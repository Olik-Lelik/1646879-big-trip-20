import { UpdateType, UserAction } from '../const';
import { remove, render } from '../framework/render';
import { Destination, Offer, Point } from '../types/types';
import FormView from '../view/trip-form';

interface NewPointForm {
  container: HTMLElement,
  destinations: Destination[];
  offers: Offer[];
  onDataChange(userAction: UserAction, updateType: UpdateType, updatePoint: Point): void,
  onDestroy(): void;
}

export default class NewPointPresenter {
  #container: HTMLElement = null;
  #destinations: Destination[] = null;
  #offers: Offer[] = null;
  #waypointCreationForm: FormView = null;
  #handleDataChange: (userAction: UserAction, updateType: UpdateType, updatePoint: Point) => void;
  #handleDestroy: () => void;

  constructor({container, destinations, offers, onDataChange, onDestroy}: NewPointForm) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#waypointCreationForm !== null) {
      return;
    }

    this.#waypointCreationForm = new FormView({
      // getOffersByType: (type: OfferType) => this.#offers.getByType(type),
      destinations: this.#destinations,
      offers: this.#offers,
      typeForm: 'creating',
      onFormSubmit: this.#handleFormSubmit,
      onCancleClick: this.#handleFormClose
    });

    render(this.#container, this.#waypointCreationForm, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    // if (this.#waypointCreationForm === null) {
    //   return;
    // }

    this.#handleDestroy();

    remove(this.#waypointCreationForm);
    this.#waypointCreationForm = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point: Point) => {
    this.#handleDataChange(
      'add_point',
      'minor',
      {id: crypto.randomUUID(), ...point}
    );
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

