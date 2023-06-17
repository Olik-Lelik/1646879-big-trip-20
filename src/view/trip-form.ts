import dayjs from 'dayjs';
import { TYPES } from '../const';
import { Destination, Offer, OfferItem, Picture, Point } from '../types/types';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

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
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${point.type}" ${isChecked(id)}>
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

interface GeneralProps {
  point: Point;
  destinations: Destination[];
  destination: Destination;
  getOffersByType(type: Offer['type']): OfferItem[];
  getDestinationByCity(city: Destination['name']): Destination;
}

function createTemplate({point, destinations, destination, getOffersByType}: GeneralProps) {
  const {price, dateFrom, dateTo} = point;

  const currentOffers = getOffersByType(point.type);

  return /*html*/`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${TYPES.map((type) => createEventTypeItem(type, point)).join('')}
      </fieldset>
    </div>
  </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
    ${point.type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${destinations.map(createDestinationOption).join('')}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YYYY HH:mm')}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YYYY HH:mm')}">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Cancel</button>
  <button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
  </button>
  </header>
  <section class="event__details">
  ${createEventOffersSection(currentOffers, point)}
  ${createEventDestinationSection(destination)}
  </section>
  </form>
  </li>`;
}

type FormViewProps = GeneralProps & {
  point: Point;
  onRollupClick(): void;
  onFormSubmit(point: Point): void;
}

interface State {
  point: Point;
  destination: Destination;
}
export default class FormView extends AbstractStatefulView {
  #destinations: Destination[];
  #onRollupClick: () => void;
  #onFormSubmit: (point: Point) => void;
  #getOffersByType: (type: Offer['type']) => OfferItem[];
  #getDestinationByCity: (city: string) => Destination;

  declare _state: State;

  // declare _setState(update: State): void;

  constructor({point, destinations, destination, onRollupClick, onFormSubmit, getOffersByType, getDestinationByCity}: FormViewProps) {
    super();
    this._setState({
      point: {...point},
      destination
    });
    this.#destinations = destinations;
    this.#onRollupClick = onRollupClick;
    this.#onFormSubmit = onFormSubmit;
    this.#getOffersByType = getOffersByType;
    this.#getDestinationByCity = getDestinationByCity;

    this._restoreHandlers();
  }

  _restoreHandlers = () => {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector<HTMLButtonElement>('.event__rollup-btn')
      .addEventListener('click', this.#buttonRollupHandler);

    this.element.querySelector<HTMLElement>('.event__type-group')
      .addEventListener('change', this.#typePointClick);

    this.element.querySelector<HTMLInputElement>('.event__input--destination')
      .addEventListener('change', this.#cityChange);
  };

  get template() {
    const {point, destination} = this._state;
    return createTemplate({
      point,
      destination,
      destinations: this.#destinations,
      getOffersByType: this.#getOffersByType,
      getDestinationByCity: this.#getDestinationByCity
    });
  }

  #formSubmitHandler = (evt: SubmitEvent) => {
    evt.preventDefault();
    this.#onFormSubmit(FormView.parseStateToPoint(this._state.point));
  };

  #buttonRollupHandler = (evt: Event) => {
    evt.preventDefault();
    this.#onRollupClick();
  };

  #typePointClick = (evt: Event) => {
    evt.preventDefault();
    const input = evt.target as HTMLInputElement;

    this.updateElement({
      ...this._state,
      type: input.value,
      offers: []
    });
  };

  #cityChange = (evt: Event) => {
    const city = (evt.target as HTMLInputElement).value;

    if (city === this._state.destination.name || city === '') {
      return;
    }

    const destination = this.#getDestinationByCity(city);

    if(destination) {
      this.updateElement({
        point: {
          ...this._state.point,
          destination: destination.id
        },
        destination
      });
    }
  };

  static parsePointToState(point: Point, destination: Destination) {
    return {
      point: {...point},
      destination
    };
  }

  static parseStateToPoint(state: Point) {
    return {
      ...state
    };
  }
}
