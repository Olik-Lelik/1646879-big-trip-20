import AbstractView from '../framework/view/abstract-view';

type SortId = 'day' | 'event' | 'time' | 'price' | 'offer';

interface SortItemProps {
  id: SortId;
  isChecked?: boolean;
  disabled?: boolean;
}

const SORT_ITEMS: SortItemProps[] = [
  {id: 'day', isChecked: true},
  {id: 'event', disabled: true},
  {id: 'time'},
  {id: 'price'},
  {id: 'offer', disabled: true},
];


function createSortRadio({id, isChecked = false}: SortItemProps){
  const htmlId = `sort-${id}`;
  const checked = isChecked ? 'checked' : '';
  return `<div class="trip-sort__item  trip-sort__item--${id}">
  <input id="${htmlId}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${id}" ${checked}>
  <label class="trip-sort__btn" for="${htmlId}">${id}</label>
</div>`;
}


function createTemplate() {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SORT_ITEMS.map(createSortRadio).join('')}
</form>`;
}

export default class SortView extends AbstractView {
  get template() {
    return createTemplate();
  }
}
