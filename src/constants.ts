export const LEVEL_CONFIG = {
  1: { hp: 100, xpToNext: 100, silver: 0, gold: 0, diamonds: 0, noviceItems: 1, bonus: "" },
  2: { hp: 250, xpToNext: 250, silver: 50, gold: 0, diamonds: 0, noviceItems: 1, bonus: "" },
  3: { hp: 400, xpToNext: 450, silver: 100, gold: 0, diamonds: 0, noviceItems: 1, bonus: "" },
  4: { hp: 600, xpToNext: 700, silver: 150, gold: 0, diamonds: 0, noviceItems: 2, bonus: "" },
  5: { hp: 800, xpToNext: 1000, silver: 200, gold: 1, diamonds: 0, noviceItems: 2, bonus: "" },
  6: { hp: 1000, xpToNext: 1400, silver: 300, gold: 1, diamonds: 0, noviceItems: 2, bonus: "+5% XP с боёв" },
  7: { hp: 1200, xpToNext: 1900, silver: 400, gold: 2, diamonds: 0, noviceItems: 2, bonus: "+5% XP с боёв" },
  8: { hp: 1500, xpToNext: 2500, silver: 500, gold: 2, diamonds: 0, noviceItems: 3, bonus: "+5% XP с боёв" },
  9: { hp: 1800, xpToNext: 3200, silver: 600, gold: 3, diamonds: 0, noviceItems: 3, bonus: "+5% XP с боёв" },
  10: { hp: 2200, xpToNext: 4000, silver: 800, gold: 5, diamonds: 1, noviceItems: 3, bonus: "Бонус к хп +5%" },
  11: { hp: 2600, xpToNext: 5000, silver: 1000, gold: 5, diamonds: 1, noviceItems: 4, bonus: "Бонус к хп +5%" },
  12: { hp: 3000, xpToNext: 6200, silver: 1200, gold: 6, diamonds: 1, noviceItems: 4, bonus: "Бонус к хп +5%" },
  13: { hp: 3500, xpToNext: 7500, silver: 1500, gold: 7, diamonds: 2, noviceItems: 4, bonus: "Бонус к хп +5%" },
  14: { hp: 4000, xpToNext: 9000, silver: 1800, gold: 8, diamonds: 2, noviceItems: 5, bonus: "+1 к стату" },
  15: { hp: 4500, xpToNext: 10800, silver: 2200, gold: 10, diamonds: 3, noviceItems: 5, bonus: "+1 к стату" },
  16: { hp: 5000, xpToNext: 12800, silver: 2600, gold: 12, diamonds: 3, noviceItems: 5, bonus: "+1 к стату" },
  17: { hp: 5500, xpToNext: 15000, silver: 3000, gold: 15, diamonds: 4, noviceItems: 6, bonus: "+1 к стату" },
  18: { hp: 6000, xpToNext: 17500, silver: 3500, gold: 18, diamonds: 4, noviceItems: 6, bonus: "+1 к стату" },
  19: { hp: 6500, xpToNext: 20500, silver: 4000, gold: 20, diamonds: 5, noviceItems: 6, bonus: "+1 к стату" },
  20: { hp: 7500, xpToNext: 24000, silver: 5000, gold: 30, diamonds: 10, noviceItems: 7, bonus: "Титул + топ бонус" },
};

export const getLevelStats = (level: number) => {
  if (level >= 20) return LEVEL_CONFIG[20];
  return LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG[1];
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

export * from './constants/battle';
