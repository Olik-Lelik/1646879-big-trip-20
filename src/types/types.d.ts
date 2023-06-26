import { FilterType, TYPES } from '../const';

type OfferType = typeof TYPES[number];

interface Picture {
  src: string;
  description: string;
}

interface Destination {
  id: string;
  description: string;
  name: string;
  pictures: Picture[];
}

interface OfferItem {
  id: string
  title: string
  price: number
}

interface Offer {
  type: OfferType;
  offers: OfferItem[];
}

interface Point {
  id: string,
  price: number,
  dateFrom: Date,
  dateTo: Date,
  destination: string,
  favorite: boolean,
  offers: OfferItem['id'][],
  type: OfferType,
}

interface State {
  id: string,
  price: number,
  dateFrom: Date,
  dateTo: Date,
  destination: string,
  favorite: boolean,
  offers: OfferItem['id'][],
  type: OfferType,
  isSaving: boolean,
  isDisabled: boolean,
  isDeleting: boolean
}
interface PointService {
  id: string,
  base_price: number,
  date_from: string | null,
  date_to: string | null,
  destination: string,
  is_favorite: boolean,
  offers: OfferItem['id'][],
  type: OfferType
}

interface Filter {
  type: FilterType,
  count: number
}

export { Destination, Picture, OfferItem, Offer, Point, Filter, PointService, State};
