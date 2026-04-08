export type ItemCategory = 'weapon' | 'armor';
export const WEAPON_TYPES = ['sword', 'staff', 'axe', 'sledgehammer', 'bow', 'crossbow'];
export const ARMOR_TYPES = ['helmet', 'chest', 'gloves', 'pants', 'boots', 'amulet', 'ring'];
export const ITEM_LEVELS = [1, 5, 10, 15, 20, 30, 40, 45, 50];

const TYPE_NAMES: Record<string, string> = {
  sword: 'Меч', staff: 'Посох', axe: 'Топор', sledgehammer: 'Кувалда', bow: 'Лук', crossbow: 'Арбалет',
  helmet: 'Шлем', chest: 'Нагрудник', gloves: 'Перчатки', pants: 'Штаны', boots: 'Сапоги', amulet: 'Амулет', ring: 'Кольцо'
};

const PREFIXES = ['Учебный', 'Обычный', 'Крепкий', 'Стальной', 'Закаленный', 'Магический', 'Эпический', 'Легендарный', 'Мифический', 'Божественный'];

export const generateItems = (type: string, level: number) => {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const prefixIndex = Math.min(Math.floor(level / 5), PREFIXES.length - 1);
    items.push({
      id: `${type}-${level}-${i}`,
      name: `${PREFIXES[prefixIndex]} ${TYPE_NAMES[type]} ${i > 1 ? `+${i}` : ''}`,
      type,
      level,
      stats: {
        str: Math.floor(level * 2 * (1 + i * 0.1)),
        agi: Math.floor(level * 2 * (1 + i * 0.1)),
        int: Math.floor(level * 2 * (1 + i * 0.1)),
        end: Math.floor(level * 2 * (1 + i * 0.1)),
        intel: level >= 30 ? Math.floor(level * 2 * (1 + i * 0.1)) : 0,
        wis: level >= 30 ? Math.floor(level * 2 * (1 + i * 0.1)) : 0,
      },
      price: level * 100 * i,
      stars: 0
    });
  }
  return items;
};
