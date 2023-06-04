import AbstractView from '../framework/view/abstract-view.js';

const FilterType = {
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
  EVERYTHING: 'Click New Event to create your first point',
};

/**
 * @typedef Option
 * @property {'loading' | 'empty'} status
 * @property {keyof FilterType} [chosenFilter]
* */

/** @param {Option} options */
function getMessage({status = 'loading', chosenFilter}) {
  if (status === 'loading') {
    return 'Loading...';
  }

  if (chosenFilter) {
    return FilterType[chosenFilter];
  }

  return 'Something wrong...';
}

/** View to show message when data are loading or now events exists */
export default class MessageView extends AbstractView{

  /** @param {Option} options  */
  constructor(options) {
    super();
    this.message = getMessage(options);
  }

  gettTemplate() {
    return `<p class="trip-events__msg">${this.message}</p>`;
  }
}
