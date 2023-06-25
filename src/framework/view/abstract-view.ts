import {createElement} from '../render';
import './abstract-view.css';

/**
 * Функция, которая будет вызвана методом shake после завершения анимации
 */
type shakeCallback = () => void;

const enum SnakeAnimation {
  /**  Время анимации в миллисекундах */
  TIMEOUT = 600,
   /** Класс, реализующий эффект "покачивания головой" */
  CLASS_NAME = 'shake',
}

/**
 * Абстрактный класс представления
 */
export default class AbstractView<El extends HTMLElement = HTMLElement> {
  /** Элемент представления */
  #element: El | null = null;

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  /**
   * Геттер для получения элемента
   * Элемент представления
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template) as El;
    }

    return this.#element;
  }

  /**
   * Геттер для получения разметки элемента
   * @abstract
   * @returns Разметка элемента в виде строки
   */
  get template(): string {
    throw new Error('Abstract method not implemented: get template');
  }

  /** Метод для удаления элемента */
  removeElement() {
    this.#element = null;
  }

  /**
   * Метод, реализующий эффект "покачивания головой"
   * @param [callback] Функция, которая будет вызвана после завершения анимации
   */
  shake(callback?: shakeCallback) {
    this.element.classList.add(SnakeAnimation.CLASS_NAME);
    setTimeout(() => {
      this.element.classList.remove(SnakeAnimation.CLASS_NAME);
      callback?.();
    }, SnakeAnimation.TIMEOUT);
  }
}

