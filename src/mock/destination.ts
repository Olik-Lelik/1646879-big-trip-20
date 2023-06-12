import { getRandom, getRandomArrayElement } from '../utils';
import { CITIES, DESCRIPTION } from '../const';
import type { Destination, City, Picture } from '../types/types';

const getCity = (): City => getRandomArrayElement(CITIES);

const mockPhoto = (city: City): Picture => ({
  src: `https://loremflickr.com/248/152?random=${getRandom(1, 10)}`,
  description: `${city} description.`
});

export const createDestination = (): Destination => {
  const name = getCity();
  const getPhoto = () => mockPhoto(name);

  return {
    id: crypto.randomUUID(),
    description: DESCRIPTION,
    name,
    pictures: Array.from({length: getRandom(0, 5)}, getPhoto),
  };
};

