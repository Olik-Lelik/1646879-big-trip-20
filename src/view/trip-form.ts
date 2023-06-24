import { TYPES } from '../const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { Destination, Offer, OfferItem, Picture, Point } from '../types/types';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

type EditType = 'editing' | 'creating';

interface GeneralProps {
  state: Point;
  destinations: Destination[];
  offers: Offer[];
  typeForm: EditType;
  // destination: Destination;
  // getOffersByType(type: Offer['type']): OfferItem[];
  // getDestinationByCity(city: Destination['name']): Destination;
}

interface FormViewProps {
  point?: Point;
  destinations?: Destination[];
  offers?: Offer[];
  typeForm: EditType;
  onToggleClick?(): void;
  onFormSubmit(point: Point): void;
  onDeleteClick?(point: Point): void;
  onCancleClick(): void;
}

const POINT_EMPTY = {
  id: '',
  price: 0,
  dateFrom: Date,
  dateTo: Date,
  destination: '',
  favorite: false,
  offers: [],
  type: 'Taxi'
} as const;

// interface State {
//   point: Point;
//   // destination: Destination;
// }

const ButtonName = {
  'editing': 'Delete',
  'creating': 'Cancle'
} as const;

function createResetButton(type: EditType) {
  return `<button class="event__reset-btn" type="reset">${ButtonName[type]}</button>`;
}
function createRollupButton(type: EditType) {
  if (type === 'creating') {
    return;
  }
  return `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span></button>`;
}
function createFormButtons(type: EditType) {
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  ${createResetButton(type)}
  ${createRollupButton(type)}`;
}

function createDestinationOption({name}: Destination){
/*html*/return `<option value="${name}"></option>`;
}

function createEventTypeItem(type: Offer['type'], point: Point) {
  return /*html*/ `<div class="event__type-item">
<input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : ''}>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${type}</label>
</div>`;
}

function createEventOffersSection(offers: OfferItem[], point: Point) {
  if (offers.length === 0) {
    return '';
  }
  const isChecked = (id: OfferItem['id']) => point.offers.includes(id) ? 'checked' : '';

  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
    ${offers.map(({id, title, price}: OfferItem) => /*html*/ `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" data-offer-id="${id}" type="checkbox" name="event-offer-${point.type}" ${isChecked(id)}>
    <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label></div>`
  ).join('')}
  </div>
</section>`;
}

function createDestinationDescription(description: Destination['description'], name: Destination['name']) {
  return (description.length > 0 ? `<p class="event__destination-description">${name} - ${description}</p>` : '');
}

function createDestinationPhotos(pictures: Picture[]) {
  return (pictures.length > 0 ?
    `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${pictures.map(({src, description}) => /*html*/ `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
    </div>
    </div>` : '');
}

function createEventDestinationSection(destination: Destination) {
  const {description, name, pictures} = destination;

  return(
    (description.length > 0 || pictures.length > 0) ?
    /*html*/ `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  ${createDestinationDescription(description, name)}
  ${createDestinationPhotos(pictures)}
  </section>` : '');
}

function createTemplate({state, destinations, offers, typeForm}: GeneralProps) {
  const {price, dateFrom, dateTo} = state;


  // const currentOffers = getOffersByType(point.type);
  const currentDestination = destinations.find((element) => element.id === state.destination);
  const currentOffers = offers.find((element) => element.type === state.type).offers;

  return /*html*/`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
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
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(currentDestination.name)}" list="destination-list-1">
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

  ${createFormButtons(typeForm)}
  </header>
  <section class="event__details">
  ${createEventOffersSection(currentOffers, state)}
  ${createEventDestinationSection(currentDestination)}
  </section>
  </form>
  </li>`;
}

export default class FormView extends AbstractStatefulView<Point> {
  #destinations: Destination[];
  #offers: Offer[];
  #typeForm: EditType;
  #datePickerFrom: flatpickr.Instance = null;
  #datePickerTo: flatpickr.Instance = null;
  // #getOffersByType: (type: Offer['type']) => OfferItem[];
  // #getDestinationByCity: (city: string) => Destination;
  #handleToggleClick: () => void;
  #handleFormSubmit: (point: Point) => void;
  #handleDeleteClick: (point: Point) => void;
  #handleCancleClick: () => void;

  constructor({point, destinations, offers, onToggleClick, onFormSubmit, onDeleteClick, onCancleClick, typeForm}: FormViewProps) {
    super();
    this._setState(FormView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#typeForm = typeForm;
    // this.#getOffersByType = getOffersByType;
    // this.#getDestinationByCity = getDestinationByCity;
    this.#handleToggleClick = onToggleClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCancleClick = onCancleClick;

    this._restoreHandlers();
  }

  _restoreHandlers = () => {
    this.element.querySelector<HTMLFormElement>('form')
      .addEventListener('submit', this.#formSubmitHandler);

    const resetButton = this.element.querySelector<HTMLFormElement>('.event__reset-btn');

    if (resetButton.textContent === ButtonName['creating']) {
      resetButton.addEventListener('click', this.#pointCancleHandler);
    } else {
      resetButton.addEventListener('click', this.#pointDeleteHandler);
    }

    this.element.querySelector<HTMLButtonElement>('.event__rollup-btn')
      .addEventListener('click', this.#toggleClickHandler);

    this.element.querySelector<HTMLElement>('.event__type-group')
      .addEventListener('change', this.#routeTypeHandler);

    this.element.querySelector<HTMLInputElement>('.event__input--destination')
      .addEventListener('change', this.#citySelectionHandler);

    const availableOffersElement = this.element.querySelector('.event__available-offers');

    if(availableOffersElement) {
      availableOffersElement.addEventListener('click', this.#offerClickHandler);
    }

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);

    this.#setDatePicker();
  };

  get template() {
    const state = this._state;
    return createTemplate({
      state,
      offers: this.#offers,
      destinations: this.#destinations,
      typeForm: this.#typeForm,
      // destination,
      // getOffersByType: this.#getOffersByType,
      // getDestinationByCity: this.#getDestinationByCity
    });
  }

  removeElement() {
    super.removeElement();

    if(this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if(this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  reset(point: Point) {
    this.updateElement(point);
  }
  // reset(point: Point) {
  //   this.updateElement(FormView.parsePointToState(point));
  // }

  #formSubmitHandler = (evt: SubmitEvent) => {
    evt.preventDefault();
    this.#handleFormSubmit(FormView.parseStateToPoint(this._state));
  };

  #pointDeleteHandler = (evt: SubmitEvent) => {
    evt.preventDefault();
    this.#handleDeleteClick(FormView.parseStateToPoint(this._state));
  };

  #pointCancleHandler = (evt: Event) => {
    evt.preventDefault();
    this.#handleCancleClick();
  };

  #toggleClickHandler = (evt: Event) => {
    evt.preventDefault();
    this.#handleToggleClick();
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

    // if (city === this._state.destination.name || city === '') {
    //   return;
    // }
    // getByCity(city: Destination['name']) {
    //   return this.#destinations
    //     .find((destination) => destination.name === city);
    // }

    const currentDestination = this.#destinations.find((destination) => destination.name === city);

    if(currentDestination) {
      this.updateElement({
        ...this._state,
        destination: currentDestination.id
      });
    }
  };

  #offerClickHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    const offersIds = checkedOffers.map((offer: Element) => (offer as HTMLElement).dataset.offerId);

    this._setState({
      ...this._state,
      offers: offersIds
    });
  };

  #priceInputChange = (evt: Event) => {
    evt.preventDefault();

    this._setState({
      ...this._state,
      price: (evt.target as HTMLInputElement).valueAsNumber
    });
  };

  #dateFromChangeHandler = ([dateFrom]: Date[]) => {
    this.updateElement({
      ...this._state,
      dateFrom: dateFrom,
    });
  };

  #dateToChangeHandler = ([dateTo]: Date[]) => {
    this.updateElement({
      ...this._state,
      dateTo: dateTo,
    });
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

  // static parsePointToState(point: Point, destination: Destination) {
  static parsePointToState(point: Point) {
    return {
      ...point
    };
  }

  static parseStateToPoint(state: Point) {
    return {
      ...state,
    };
  }
}
