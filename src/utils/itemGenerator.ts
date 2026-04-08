export type ItemCategory = 'weapon' | 'armor';
export const WEAPON_TYPES = ['sword', 'axe'];
export const ARMOR_TYPES = ['helmet', 'chest', 'gloves', 'pants', 'boots', 'amulet', 'ring'];
export const ITEM_LEVELS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const TYPE_NAMES: Record<string, string> = {
  sword: 'Меч', axe: 'Топор',
  helmet: 'Шлем', chest: 'Нагрудник', gloves: 'Перчатки', pants: 'Штаны', boots: 'Сапоги', amulet: 'Амулет', ring: 'Кольцо'
};

const PREFIXES = ['Учебный', 'Обычный', 'Крепкий', 'Стальной', 'Закаленный', 'Магический', 'Эпический', 'Легендарный', 'Мифический', 'Божественный'];

export const generateItems = (type: string, level: number) => {
  const items = [];
  const prefixIndex = Math.min(Math.floor((level - 1) / 2), PREFIXES.length - 1);
  items.push({
    id: `${type}-${level}-1`,
    name: `${PREFIXES[prefixIndex]} ${TYPE_NAMES[type] || type}`,
    type,
    level,
    stats: {
      str: Math.floor(level * 5),
      agi: Math.floor(level * 5),
      int: Math.floor(level * 5),
      end: Math.floor(level * 5),
      intel: level >= 10 ? Math.floor(level * 5) : 0,
      wis: level >= 10 ? Math.floor(level * 5) : 0,
    },
    price: level * 500,
    stars: 0
  });
  return items;
};
