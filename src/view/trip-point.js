import {createElement} from '../render.js';
import{ getDateDuration, formatStringToDateTime, formatStringToShortDateTime, formatStringToHumanizeDateTime, formatStringToTime } from '../utils';

const createOfferItem = ({title, price}) => /*html*/`<li class="event__offer">
<span class="event__offer-title">${title}</span>
&plus;&euro;&nbsp;
<span class="event__offer-price">${price}</span>
</li>`;


function createTemplate({point, pointDestination, pointOffers}) {
  const {price, dateFrom, dateTo, favorite, type} = point;

  const hasFavorite = favorite > 0 ? '--active' : '';

  return `<div class="event">
    <time class="event__date" datetime="${formatStringToShortDateTime(dateFrom)}">${formatStringToHumanizeDateTime(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${pointDestination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${formatStringToDateTime(dateFrom)}">${formatStringToTime(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime="${formatStringToDateTime(dateTo)}">${formatStringToTime(dateTo)}</time>
      </p>
      <p class="event__duration">${getDateDuration(dateTo, dateFrom)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${pointOffers.map(createOfferItem).join('')}
    </ul>
    <button class="event__favorite-btn event__favorite-btn${hasFavorite}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`;
}

export default class PointView {
  constructor({point, pointDestination, pointOffers}) {
    this.point = point;
    this.pointDestination = pointDestination;
    this.pointOffers = pointOffers;
  }

  getTemplate() {
    return createTemplate({
      point: this.point,
      pointDestination: this.pointDestination,
      pointOffers: this.pointOffers
    });
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

