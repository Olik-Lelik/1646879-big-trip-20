import { TYPES, CITIES } from "../const";

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
    dateFrom: string,
    dateTo: string,
    destination: string,
    favorite: boolean,
    offers: Array<string>,
    type: OfferType
}

export { OfferType, City, Destination, Picture, OfferItem, Offer, Point };
