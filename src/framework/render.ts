import AbstractView from './view/abstract-view';

/**
 * Функция для создания элемента на основе разметки
 * @param template Разметка в виде строки
 * @returns Созданный элемент
 */
function createElement(template: string): HTMLElement {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild as HTMLElement;
}

/**
 * Функция для отрисовки элемента
 * @param container Элемент в котором будет отрисован компонент
 * @param component Компонент, который должен был отрисован
 * @param place Позиция компонента относительно контейнера. По умолчанию - `beforeend`
 */
function render(container: HTMLElement, component: AbstractView, place: InsertPosition = 'beforeend') {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can render only components');
  }

  if (container === null) {
    throw new Error('Container element doesn\'t exist');
  }

  container.insertAdjacentElement(place, component.element);
}

/**
 * Функция для замены одного компонента на другой
 * @param newComponent Компонент, который нужно показать
 * @param oldComponent Компонент, который нужно скрыть
 */
function replace(newComponent: AbstractView, oldComponent: AbstractView) {
  if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
    throw new Error('Can replace only components');
  }

  const newElement = newComponent.element;
  const oldElement = oldComponent.element;

  const parent = oldElement.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newElement, oldElement);
}

/**
 * Функция для удаления компонента
 * @param component Компонент, который нужно удалить
 */
function remove(component: AbstractView | null) {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
}

export { createElement, render, replace, remove };
