import { TYPES } from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { Destination, Offer, OfferItem, Picture, Point, State } from '../types/types';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

type EditType = 'EDITING' | 'CREATING';

interface GeneralProps {
  state: State;
  destinations: Destination[];
  offers: Offer[];
  status: EditType;
}
interface FormViewProps {
  point: Point;
  destinations: Destination[];
  offers: Offer[];
  status: EditType;
  onToggleClick?(): void;
  onFormSubmit(point: Point): void;
  onFormReset(point?: Point): void;
}

function createFormButtons(type: EditType, {isDeleting, isDisabled}: State) {
  if (type === 'CREATING') {
    return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`;
  } else {
    return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>  <span class="visually-hidden">Open event</span></button>`;
  }
}

function createDestinationOption({ name }: Destination) {
  /*html*/ return `<option value="${name}"></option>`;
}

function createEventTypeItem(type: Offer['type'], point: Point) {
  return /*html*/ `<div class="event__type-item">
<input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${
  point.type === type ? 'checked' : ''
}>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${type}</label>
</div>`;
}

function createEventOffersSection(offers: OfferItem[], point: Point) {
  if (offers.length === 0) {
    return '';
  }
  const isChecked = (id: OfferItem['id']) =>
    point.offers.includes(id) ? 'checked' : '';

  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
    ${offers.map(({id, title, price,}: OfferItem) => /*html*/ `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" data-offer-id="${id}" type="checkbox" name="event-offer-${
  point.type
}" ${isChecked(id)}>
    <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label></div>`)
    .join('')}
  </div>
</section>`;
}

function createDestinationDescription(
  description: Destination['description'],
  name: Destination['name']
) {
  return description.length > 0
    ? `<p class="event__destination-description">${name} - ${description}</p>`
    : '';
}

function createDestinationPhotos(pictures: Picture[]) {
  return pictures.length > 0
    ? `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${pictures
    .map(
      ({ src, description }) =>
      /*html*/ `<img class="event__photo" src="${src}" alt="${description}">`
    )
    .join('')}
    </div>
    </div>`
    : '';
}

function createEventDestinationSection(destination: Destination) {
  const { description, name, pictures } = destination;

  return description.length > 0 || pictures.length > 0
    ? /*html*/ `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  ${createDestinationDescription(description, name)}
  ${createDestinationPhotos(pictures)}
  </section>`
    : '';
}

function createTemplate({ state, destinations, offers, status }: GeneralProps) {
  const { price, dateFrom, dateTo, isSaving, isDisabled } = state;

  const currentDestination = destinations.find((element) => element.id === state.destination);
  const currentOffers = offers?.find((element) => element.type === state.type)?.offers || [];

  return /*html*/ `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${
  state.type
}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${TYPES.map((type) => createEventTypeItem(type, state)).join('')}
      </fieldset>
    </div>
  </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
    ${state.type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? he.encode(currentDestination.name) : ''}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${destinations.map(createDestinationOption).join('')}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
  </div>
  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
  ${createFormButtons(status, state)}
  </header>
  <section class="event__details">
  ${createEventOffersSection(currentOffers, state)}
  ${currentDestination ? createEventDestinationSection(currentDestination) : ''}
  </section>
  </form>
  </li>`;
}

export default class FormView extends AbstractStatefulView<State> {
  #destinations: Destination[];
  #offers: Offer[];
  #status: EditType;
  #datePickerFrom: flatpickr.Instance | null = null;
  #datePickerTo: flatpickr.Instance | null = null;
  #handleToggleClick!: () => void;
  #handleFormSubmit: (point: State) => void = null;
  #handleFormReset: (point: State) => void;

  constructor({point, destinations, offers, onToggleClick, onFormSubmit, onFormReset, status}: FormViewProps) {
    super();
    const isCreating = status === 'CREATING';
    const isEditing = !isCreating;

    this._setState(FormView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#status = status;

    this.#handleFormReset = onFormReset;

    if (isEditing) {
      this.#handleToggleClick = onToggleClick;
    }

    this.#handleFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  _restoreHandlers = () => {
    const form = this.element.querySelector<HTMLFormElement>('form');

    form.addEventListener('submit', this.#formSubmitHandler);
    form.addEventListener('reset', this.#formResetHandler);

    if (this.#status === 'EDITING') {
      form.querySelector<HTMLButtonElement>('.event__rollup-btn')?.addEventListener('click', this.#handleToggleClick);
    }

    form
      .querySelector<HTMLElement>('.event__type-group')
      ?.addEventListener('change', this.#routeTypeHandler);

    form
      .querySelector<HTMLInputElement>('.event__input--destination')
      ?.addEventListener('change', this.#citySelectionHandler);

    const availableOffersElement = this.element.querySelector('.event__available-offers');

    if (availableOffersElement) {
      availableOffersElement.addEventListener('click', this.#offerClickHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChange);

    this.#setDatePicker();
  };

  get template() {
    const state = this._state;

    return createTemplate({
      state,
      offers: this.#offers,
      destinations: this.#destinations,
      status: this.#status,
    });
  }

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  reset(point: Point) {
    this.updateElement(point);
  }

  #formResetHandler = (evt: Event) => {
    evt.preventDefault();
    return this.#handleFormReset(FormView.parseStateToPoint(this._state));
  };

  #formValidate() {
    const point = this._state;
    return point.destination && point.dateFrom && point.dateTo && point.price && point.dateTo >= point.dateFrom;
  }

  #formSubmitHandler = (evt: SubmitEvent) => {
    evt.preventDefault();
    if (this.#formValidate()) {
      return this.#handleFormSubmit(FormView.parseStateToPoint(this._state));
    }

    return this.shake();
  };

  #routeTypeHandler = (evt: Event) => {
    evt.preventDefault();

    this.updateElement({
      ...this._state,
      type: (evt.target as HTMLInputElement).value as Offer['type'],
      offers: []
    });
  };

  #citySelectionHandler = (evt: Event) => {
    const city = (evt.target as HTMLInputElement).value;

    const currentDestination = this.#destinations.find((destination) => destination.name === city);

    if (currentDestination) {
      this.updateElement({
        ...this._state,
        destination: currentDestination.id
      });
    }
  };

  #offerClickHandler = () => {
    const checkedOffers = Array.from(
      this.element.querySelectorAll('.event__offer-checkbox:checked')
    );

    const offersIds = checkedOffers.map(
      (offer: Element) => (offer as HTMLElement).dataset.offerId
    ) as string[];

    this._setState({
      ...this._state,
      offers: offersIds
    });
  };

  #priceInputChange = (evt: Event) => {
    evt.preventDefault();
    const input = evt.target as HTMLInputElement;
    const price = Number(input.value);

    this._setState({
      ...this._state,
      price
    });
  };

  #dateFromChangeHandler = ([dateFrom]: Date[]) => {
    this.updateElement({
      ...this._state,
      dateFrom: dateFrom,
    });

    this.#datePickerFrom.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([dateTo]: Date[]) => {
    this.updateElement({
      ...this._state,
      dateTo: dateTo,
    });

    this.#datePickerFrom.set('maxDate', this._state.dateTo);
  };

  #setDatePicker() {
    const [dateFrom, dateTo] = this.element.querySelectorAll('.event__input--time');
    this.#datePickerFrom = flatpickr(
      dateFrom,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        enableTime: true,
        'time_24hr': true,
        'locale': {
          'firstDayOfWeek': 1 // start week on Monday
        },
        onChange: this.#dateFromChangeHandler
      }
    );
    this.#datePickerTo = flatpickr(
      dateTo,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        enableTime: true,
        'time_24hr': true,
        'locale': {
          'firstDayOfWeek': 1 // start week on Monday
        },
        onChange: this.#dateToChangeHandler
      }
    );
  }

  static parsePointToState(point: Point) {
    return {
      ...point,
      isSaving: false,
      isDisabled: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state: State) {
    const point = state;

    delete point.isSaving;
    delete point.isDisabled;
    delete point.isDeleting;

    return point;
  }
}
