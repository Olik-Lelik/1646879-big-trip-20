import { getRandom, getRandomArrayElement } from '../utils.js';
import { CITES, DESCRIPTION } from '../const.js';

const createDestination = () => {
  const cite = getRandomArrayElement(CITES);
  const photo = `https://loremflickr.com/248/152?random=${getRandom(1, 10)}`;

  return {
    'id': crypto.randomUUID(),
    'description': DESCRIPTION,
    'name': cite,
    'pictures': [
      {
        'src': photo,
        'description': `${cite} description`
      }
    ]
  };
};

export {createDestination};
