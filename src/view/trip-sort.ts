import { SortType } from '../const';
import AbstractView from '../framework/view/abstract-view';

interface SortItemProps {
  type: SortType;
  isChecked?: boolean;
  isdisabled?: boolean;
}

const SORT_ITEMS: SortItemProps[] = [
  {type: 'day', isChecked: true},
  {type: 'event', isdisabled: true},
  {type: 'time'},
  {type: 'price'},
  {type: 'offer', isdisabled: true},
];

function createSortRadio({type, isChecked, isdisabled}: SortItemProps){
  const htmlId = `sort-${type}`;
  const checked = isChecked ? 'checked' : '';
  const disabled = isdisabled ? 'disabled' : '';

  return `<div class="trip-sort__item  trip-sort__item--${type}">
  <input data-sort-type="${type}" id="${htmlId}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}" ${disabled} ${checked}>
  <label class="trip-sort__btn" for="${htmlId}">${type}</label>
</div>`;
}


function createTemplate() {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SORT_ITEMS.map(createSortRadio).join('')}
</form>`;
}


type Sort = {
  onSortTypeChange(sortType: SortType): void,
}
export default class SortView extends AbstractView {
  #element: HTMLFormElement | null;
  #onSortTypeChange: (sortType: SortType) => void;

  constructor({onSortTypeChange}: Sort) {
    super();
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt: Event) => {
    this.#onSortTypeChange((evt.target as HTMLInputElement).value as SortType);
  };

  get template() {
    return createTemplate();
  }
}
