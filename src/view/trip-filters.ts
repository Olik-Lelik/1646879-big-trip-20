import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

interface FilterItem {
    filterType: FilterType;
    count: number;
}

function createFilterItem({filterType, count}: FilterItem, currentFilterType: FilterType) {
  const isChecked = filterType === currentFilterType ? 'checked' : '';

  return `  <div class="trip-filters__filter">
  <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" ${count ? '' : 'disabled'} ${isChecked}>
  <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
</div>
`;
}

interface Filter {
  filters: FilterItem[],
  currentFilterType: FilterType,
}

function createTemplate({filters, currentFilterType}: Filter) {
  return `<form class="trip-filters" action="#" method="get">
  ${filters.map((filter) => createFilterItem(filter, currentFilterType)).join('')}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
}

type FilterProps = Filter & {
  onFilterTypeChange(filterType: FilterType): void,
}
export default class FiltersView extends AbstractView {
  #filters: FilterItem[] = [];
  #currentFilterType: FilterType = 'EVERYTHING';
  #onFilterTypeChange: (filterType: FilterType) => void;

  constructor({filters, currentFilterType, onFilterTypeChange}: FilterProps) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createTemplate({
      filters: this.#filters,
      currentFilterType: this.#currentFilterType
    });
  }

  #filterChangeHandler = (evt: Event) => {
    evt.preventDefault();
    this.#onFilterTypeChange((evt.target as HTMLInputElement).value as FilterType);
  };
}
