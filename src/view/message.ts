import AbstractView from '../framework/view/abstract-view';

const FilterType = {
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
  EVERYTHING: 'Click New Event to create your first point',
} as const;

type Option = {
  status: 'loading'
} | {
  status: 'empty',
  chosenFilter: keyof typeof FilterType
};

function getMessage(options: Option) {
  if (options.status === 'loading') {
    return 'Loading...';
  }

  return FilterType[options.chosenFilter];
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
