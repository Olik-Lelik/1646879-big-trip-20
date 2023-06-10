import AbstractView from '../framework/view/abstract-view.js';

const FilterType = {
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
  EVERYTHING: 'Click New Event to create your first point',
} as const;

interface Option {
  status: 'loading' | 'empty',
  chosenFilter: keyof typeof FilterType
}


function getMessage({status = 'loading', chosenFilter}: Option) {
  if (status === 'loading') {
    return 'Loading...';
  }

  if (chosenFilter) {
    return FilterType[chosenFilter];
  }

  return 'Something wrong...';
}

export default class MessageView extends AbstractView{
  #message;

  constructor(options: Option) {
    super();
    this.#message = getMessage(options);
  }

  get template() {
    return `<p class="trip-events__msg">${this.#message}</p>`;
  }
}
