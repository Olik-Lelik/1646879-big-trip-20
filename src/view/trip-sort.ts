import { SortType } from '../const';
import AbstractView from '../framework/view/abstract-view';

interface SortItemProps {
  type: SortType;
  isdisabled?: boolean;
}

const SORT_ITEMS: SortItemProps[] = [
  {type: 'day'},
  {type: 'event', isdisabled: true},
  {type: 'time'},
  {type: 'price'},
  {type: 'offer', isdisabled: true},
];

function createTemplate(currentSortType: SortType){

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SORT_ITEMS.map(({type, isdisabled}: SortItemProps) => {
    const htmlId = `sort-${type}`;
    const checked = type === currentSortType ? 'checked' : '';
    const disabled = isdisabled ? 'disabled' : '';

    return `<div class="trip-sort__item  trip-sort__item--${type}">
<input id="${htmlId}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}" ${disabled} ${checked}>
<label class="trip-sort__btn" for="${htmlId}">${type}</label>
</div>`;
  }).join('')}
  </form>`;
}

type Sort = {
  currentSortType:SortType,
  onSortTypeChange(sortType: SortType): void,
}
export default class SortView extends AbstractView {
  #currentSortType: SortType;
  #onSortTypeChange: (sortType: SortType) => void;

  constructor({currentSortType, onSortTypeChange}: Sort) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt: Event) => {
    this.#onSortTypeChange((evt.target as HTMLInputElement).value as SortType);
  };

  get template() {
    return createTemplate(this.#currentSortType);
  }
}
