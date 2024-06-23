interface ITypedSection {
  id: 'added' | 'fixed' | 'changed';
  content: string[];
}

interface IUpdate {
  added?: ITypedSection;
  changed?: ITypedSection;
  fixed?: ITypedSection;
  createdAt: Date;
}

export const changelog: IUpdate[] = [
  {
    added: {
      id: 'added',
      content: [
        `Добавлена возможность управлять таймером при помощи клавиш:\n[ ↑ ] - прибавить,\n[ ↓ ] - убавить,\n[←] - вернуть на исходную,\n[→] - запустить / приостановить.`,
        "Добавлена новая настройка таймера: включить / выключить управление при помощи клавиш. (Включена по умолчанию)",
      ]
    },
    changed: {
      id: 'changed',
      content: [
        "При активации функции 'Стоп колесо', сообщение из доната не будет учитываться (т.е. указанный вариант не будет добавлен / обновлен).",
        "Во время задержки колеса, обновить / добавить вариант можно только активировав функцию 'Вклин'.",
        "Настройки 'Вклин' и 'Продлить кручение' объединены в одну.",
        "Увеличен минимально возможный размер секции колеса для отображения текста."
      ]
    },
    createdAt: new Date('2024-06-23 14:52:14'),
  },
]

export function getLastUpdateDate() {
  const sorted = [...changelog].sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  })

  return sorted[0].createdAt;
}