import {RenderPosition, render} from './render.js';
import TripInfo from './view/trip-info.js';
import Presenter from './presenter/presenter.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');

render(siteHeaderElement, new TripInfo, RenderPosition.AFTERBEGIN);

const presenter = new Presenter({container: siteMainElement});
presenter.init();
