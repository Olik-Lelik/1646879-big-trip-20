import AbstractView from './abstract-view';

/**
 * Абстрактный класс представления с состоянием
 */
export default class AbstractStatefulView<State> extends AbstractView {
  /** Объект состояния */
  _state = {} as State;

  /**
   * Метод для обновления состояния и перерисовки элемента
   * @param update Объект с обновлённой частью состояния
   */
  updateElement(update: Partial<State>) {
    if (!update) {
      return;
    }

    this._setState(update);

    this.#rerenderElement();
  }

  /**
   * Метод для восстановления обработчиков после перерисовки элемента
   * @abstract
   */
  _restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  /**
   * Метод для обновления состояния
   * @param update Объект с обновлённой частью состояния
   */
  _setState(update: State | Partial<State>) {
    this._state = structuredClone({...this._state, ...update});
  }

  /** Метод для перерисовки элемента */
  #rerenderElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent?.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }
}
