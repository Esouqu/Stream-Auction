import storable from './storable';

// const mockText = 'Колесный аук, просмотровый, только фильмы, мульты (без аниме и пони),\nЧто угодно, только без сисек, писек, попиков (для просмотра на твиче)\nФильм должен быть на кинопоиске\n(просто в базе, не обязательно, чтобы можно было смотреть)\nСкипаю любой кал, который не понравится (донат под своим ником плз)';
// const mockText = '- Играем 2 часа, если игра - Meh - Играем Вечно, если игра - Класс - Запрещены спорт/космо симы - +1 минута, при смене лидера - Аукцион КЛАССИЧЕСКИЙ - Давайте постараемся, чтобы игра была в Русском Steam';

function createTextRules() {
  const { subscribe, set, update } = storable('', 'textRules');

  return {
    subscribe,
    set
  }
}

const textRules = createTextRules();

export default textRules;