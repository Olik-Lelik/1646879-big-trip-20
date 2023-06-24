import { FilterType, UpdateType } from '../const';
import Observable from '../framework/observable';

export default class FilterModel extends Observable {
  #filterType: FilterType = 'EVERYTHING';

  get filter() {
    return this.#filterType;
  }

  setFilter(updateType: UpdateType, filterType: FilterType) {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  }
}
