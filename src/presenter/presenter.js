import {render} from '../render.js';
import FiltersView from '../view/trip-filters.js';
import SortView from '../view/trip-sort.js';
import ListView from '../view/trip-list.js';
import PointPresenter from './point.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');

export default class Presenter {
  tripListComponent = new ListView();

  /** скорее всего будем получать тут модельки всех точек */
  constructor({container}) {
    this.container = container;
  }

  init() {
    render(controlsFiltersElement, new FiltersView());
    render(this.container, new SortView());
    render(this.container, this.tripListComponent);
    new PointPresenter(this.tripListComponent.getElement());
  }
}
