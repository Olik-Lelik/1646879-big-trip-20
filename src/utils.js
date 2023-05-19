// Функция, возвращающая случайное целое число из переданного диапазона включительно.

function getRandom (min, max) {
  if (min >= max) {
    throw new Error('Диапазон включает только положительные числа. Число "от" не может быть больше или равно числу "до".');
  }

  min = Math.ceil(min);
  max = Math.floor(max);

  const random = min + Math.random() * (max - min + 1);
  return Math.floor(random);
}

const getRandomArrayElement = (elements) => elements[getRandom(0, elements.length - 1)];

export {getRandom, getRandomArrayElement};

