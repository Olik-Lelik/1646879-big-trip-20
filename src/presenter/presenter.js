import {render} from '../render.js';
import FiltersView from '../view/trip-filters.js';
import SortView from '../view/trip-sort.js';
import ListView from '../view/trip-list.js';
import PointPresenter from './point.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');

export default class Presenter {
  tripListComponent = new ListView();

  /** скорее всего будем получать тут модели всех точек */
  constructor({container}) {
    this.container = container;
    // this.destinationsModel = destinationsModel;
    // this.offersModel = offersModel;
    // this.pointsModel = pointsModel;

    // this.points = [...pointsModel.get()];

  }

  init({destinationsModel, offersModel, pointsModel}) {
    render(controlsFiltersElement, new FiltersView());
    render(this.container, new SortView());
    render(this.container, this.tripListComponent);

    // console.log(destinationsModel)
    // console.log(this.offersModel)
    // console.log(this.points)

    new PointPresenter({
      container: this.tripListComponent.getElement(),
      destinationsModel,
      offersModel,
      pointsModel,
    });

  }
}
