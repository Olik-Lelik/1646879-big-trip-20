/** bФункция, которая будет вызвана при наступлении события */
type ObserverCallback = (event: unknown, payload?: unknown) => void;

/** Класс, реализующий паттерн Наблюдатель. */
export default class Observable {
  /** Множество функций типа observerCallback */
  #observers = new Set<ObserverCallback>();

  /**
   * Метод, позволяющий подписаться на событие
   * @param observer Функция, которая будет вызвана при наступлении события
   */
  addObserver(observer: ObserverCallback) {
    this.#observers.add(observer);
  }

  /**
   * Метод, позволяющий отписаться от события
   * @param observer Функция, которую больше не нужно вызывать при наступлении события
   */
  removeObserver(observer: ObserverCallback) {
    this.#observers.delete(observer);
  }

  /**
   * Метод для оповещения подписчиков о наступлении события
   * @param event Тип события
   * @param payload Дополнительная информация
   */
  _notify(event: unknown, payload?: unknown) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}

