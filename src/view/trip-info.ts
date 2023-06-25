import AbstractView from '../framework/view/abstract-view';
import { formatStringToHumanizeDateTime } from '../utils';

interface Props {
  dateFrom: Date,
  dateTo: Date,
  price: number,
  cities: string[],
}

function getCitiesSummary(cities: string[]) {
  const uniqueCities = [cities[0]];
  const lastCity = cities.at(-1);

  if (cities.length === 3 && cities[1] !== cities[0]) {
    uniqueCities.push(cities[1]);
  }

  if (cities.length > 3) {
    uniqueCities.push('...');
    uniqueCities.push(lastCity!);
  }

  if (lastCity !== uniqueCities.at(-1)) {
    uniqueCities.push(lastCity!);
  }

  return uniqueCities;
}

function createTemplate({dateFrom, dateTo, price, cities}: Props) {
  const isSameMonth = dateFrom.getMonth() === dateTo.getMonth();
  const endDay = isSameMonth ? dateTo.getDate() : formatStringToHumanizeDateTime(dateTo);


  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getCitiesSummary(cities).join(' — ')}</h1>

    <p class="trip-info__dates">${formatStringToHumanizeDateTime(dateFrom)}&nbsp;—&nbsp;${endDay}</p>
  </div>
  <p class="trip-info__cost">
    Total: €<span class="trip-info__cost-value">${price}</span>
  </p>
</section>`;
}


export default class InfoView extends AbstractView {
  #props: Props | null = null;
  constructor(props: Props) {
    super();
    this.#props = props;

  }

  get template() {
    return createTemplate(this.#props!);
  }

}
