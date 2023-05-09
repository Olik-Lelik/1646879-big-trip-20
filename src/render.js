/** @type {Record<string, InsertPosition>} */
const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * @param {string} template parsable to html
 * @return {Element}
 */
function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

/**
 * @param {Element} container
 * @param {{getElement(): Element}} component
 * @param {InsertPosition} place
 */
function render(container, component, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.getElement());
}

export {RenderPosition, createElement, render};
