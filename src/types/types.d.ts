import { TYPES, CITIES, FilterType } from '../const';

type OfferType = typeof TYPES[number];
type City = typeof CITIES[number];

interface Picture {
  src: string;
  description: string;
}

interface Destination {
  id: string;
  description: string;
  name: City;
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
  type: OfferType
}
interface PointService {
  id: string,
  base_price: number,
  date_from: string,
  date_to: string,
  destination: string,
  is_favorite: boolean,
  offers: [],
  type: string
}

interface Filter {
  type: FilterType,
  count: number
}

export { OfferType, City, Destination, Picture, OfferItem, Offer, Point, Filter, PointService };
