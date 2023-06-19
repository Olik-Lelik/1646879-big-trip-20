// import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

interface FilterItem {
    type: string;
    count: number;
}

function createFilterItem({type, count}: FilterItem) {
  const checked = type === 'everything' ? 'checked' : '';

  return `  <div class="trip-filters__filter">
  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${count ? '' : 'disabled'} ${checked}>
  <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
</div>
`;
}

function createTemplate(filterPoints: FilterItem[]) {
  return `<form class="trip-filters" action="#" method="get">
  ${filterPoints.map(createFilterItem).join('')}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
}

type Filter = {
  filterPoints: FilterItem[],
  // onFilterChange(filterType: FilterType): void,
}

export default class FiltersView extends AbstractView {
  #filterPoints;
  // #onFilterChange: (filterType: FilterType) => void;

  constructor({filterPoints}: Filter) {
    super();
    this.#filterPoints = filterPoints;
    // this.#onFilterChange = onFilterChange;

    // this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createTemplate(this.#filterPoints);
  }

  // #filterChangeHandler = (evt: Event) => {
  //   evt.preventDefault();
  //   this.#onFilterChange((evt.target as HTMLInputElement).value as FilterType);
  // };
}
