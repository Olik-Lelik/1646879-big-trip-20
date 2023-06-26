import { FilterType, filter } from '../const';
import { remove, render, replace } from '../framework/render';
import { FilterModel, PointsModel } from '../model';
import FiltersView from '../view/trip-filters';

interface Filter {
  container: HTMLElement,
  pointsModel: PointsModel,
  filterModel: FilterModel
}

const FilterTypes = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST'
} as const;

export default class FilterPresenter {
  #filterContainer: HTMLElement;
  #pointsModel: PointsModel;
  #filterModel: FilterModel;
  #filtersView: FiltersView | null = null;

  constructor({container, pointsModel, filterModel}: Filter) {
    this.#filterContainer = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterTypes).map((filterType: FilterType) => ({
      filterType,
      count: filter[filterType](points).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFiltersView = this.#filtersView;

    this.#filtersView = new FiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFiltersView === null) {
      render(this.#filterContainer, this.#filtersView);
      return;
    }

    replace(this.#filtersView, prevFiltersView);
    remove(prevFiltersView);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType: FilterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter('major', filterType);
  };
}
