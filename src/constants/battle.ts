export interface BattleTier {
  level: number;
  mode: '1v1' | '2v2' | 'squad' | 'royale';
  enemyType: string;
  hp: number;
  damage: number;
  xp: number;
  iron: number;
  silver: number;
  gold: number;
}

export const BATTLE_TIERS: Record<number, BattleTier> = {
  1: { level: 1, mode: '1v1', enemyType: 'Простой', hp: 100, damage: 10, xp: 50, iron: 50, silver: 0, gold: 0 },
  2: { level: 2, mode: '1v1', enemyType: 'Простой', hp: 120, damage: 12, xp: 55, iron: 55, silver: 0, gold: 0 },
  3: { level: 3, mode: '1v1', enemyType: 'Простой', hp: 140, damage: 15, xp: 60, iron: 60, silver: 0, gold: 0 },
  4: { level: 4, mode: '1v1', enemyType: 'Простой', hp: 160, damage: 18, xp: 65, iron: 65, silver: 0, gold: 0 },
  5: { level: 5, mode: '1v1', enemyType: 'Элитный', hp: 200, damage: 25, xp: 100, iron: 80, silver: 10, gold: 1 },
  6: { level: 6, mode: '1v1', enemyType: 'Простой', hp: 220, damage: 28, xp: 70, iron: 70, silver: 5, gold: 0 },
  7: { level: 7, mode: '1v1', enemyType: 'Простой', hp: 250, damage: 30, xp: 75, iron: 75, silver: 5, gold: 0 },
  8: { level: 8, mode: '1v1', enemyType: 'Элитный', hp: 300, damage: 35, xp: 120, iron: 100, silver: 10, gold: 1 },
  9: { level: 9, mode: '1v1', enemyType: 'Простой', hp: 320, damage: 38, xp: 80, iron: 80, silver: 10, gold: 0 },
  10: { level: 10, mode: '1v1', enemyType: 'Босс', hp: 500, damage: 60, xp: 500, iron: 150, silver: 50, gold: 5 },
  11: { level: 11, mode: '2v2', enemyType: 'Простой', hp: 200, damage: 20, xp: 100, iron: 100, silver: 50, gold: 0 },
  12: { level: 12, mode: '2v2', enemyType: 'Простой', hp: 250, damage: 25, xp: 120, iron: 120, silver: 50, gold: 0 },
  13: { level: 13, mode: '2v2', enemyType: 'Элитный', hp: 400, damage: 40, xp: 300, iron: 150, silver: 80, gold: 2 },
  14: { level: 14, mode: '2v2', enemyType: 'Простой', hp: 450, damage: 45, xp: 150, iron: 150, silver: 80, gold: 0 },
  15: { level: 15, mode: '2v2', enemyType: 'Босс', hp: 800, damage: 80, xp: 1000, iron: 300, silver: 150, gold: 5 },
  16: { level: 16, mode: 'squad', enemyType: 'Простой', hp: 500, damage: 50, xp: 200, iron: 200, silver: 100, gold: 1 },
  17: { level: 17, mode: 'squad', enemyType: 'Элитный', hp: 1000, damage: 120, xp: 500, iron: 300, silver: 150, gold: 3 },
  18: { level: 18, mode: 'squad', enemyType: 'Простой', hp: 550, damage: 55, xp: 220, iron: 220, silver: 120, gold: 1 },
  19: { level: 19, mode: 'squad', enemyType: 'Элитный', hp: 1200, damage: 130, xp: 600, iron: 350, silver: 200, gold: 3 },
  20: { level: 20, mode: 'squad', enemyType: 'Босс', hp: 2500, damage: 300, xp: 3000, iron: 500, silver: 300, gold: 7 },
  21: { level: 21, mode: 'royale', enemyType: 'Мелкий', hp: 300, damage: 30, xp: 50, iron: 50, silver: 50, gold: 1 },
  22: { level: 22, mode: 'royale', enemyType: 'Мелкий', hp: 350, damage: 35, xp: 60, iron: 60, silver: 50, gold: 1 },
  23: { level: 23, mode: 'royale', enemyType: 'Средний', hp: 800, damage: 80, xp: 500, iron: 150, silver: 150, gold: 3 },
  24: { level: 24, mode: 'royale', enemyType: 'Средний', hp: 900, damage: 90, xp: 550, iron: 160, silver: 160, gold: 3 },
  25: { level: 25, mode: 'royale', enemyType: 'Босс', hp: 2000, damage: 200, xp: 3000, iron: 500, silver: 300, gold: 10 },
  26: { level: 26, mode: '1v1', enemyType: 'Простой', hp: 400, damage: 50, xp: 100, iron: 80, silver: 20, gold: 1 },
  27: { level: 27, mode: '1v1', enemyType: 'Элитный', hp: 600, damage: 70, xp: 250, iron: 120, silver: 50, gold: 2 },
  28: { level: 28, mode: '1v1', enemyType: 'Босс', hp: 1200, damage: 150, xp: 800, iron: 250, silver: 100, gold: 5 },
  29: { level: 29, mode: '2v2', enemyType: 'Простой', hp: 600, damage: 60, xp: 150, iron: 150, silver: 100, gold: 2 },
  30: { level: 30, mode: '2v2', enemyType: 'Элитный', hp: 1000, damage: 120, xp: 400, iron: 200, silver: 150, gold: 5 },
  31: { level: 31, mode: '2v2', enemyType: 'Босс', hp: 2500, damage: 300, xp: 1500, iron: 400, silver: 250, gold: 10 },
  32: { level: 32, mode: 'squad', enemyType: 'Простой', hp: 700, damage: 70, xp: 250, iron: 250, silver: 150, gold: 3 },
  33: { level: 33, mode: 'squad', enemyType: 'Элитный', hp: 1500, damage: 150, xp: 700, iron: 350, silver: 250, gold: 5 },
  34: { level: 34, mode: 'squad', enemyType: 'Босс', hp: 3000, damage: 400, xp: 3500, iron: 500, silver: 400, gold: 12 },
  35: { level: 35, mode: 'royale', enemyType: 'Мелкий', hp: 500, damage: 50, xp: 100, iron: 100, silver: 100, gold: 3 },
  36: { level: 36, mode: 'royale', enemyType: 'Средний', hp: 1200, damage: 150, xp: 600, iron: 250, silver: 200, gold: 5 },
  37: { level: 37, mode: 'royale', enemyType: 'Босс', hp: 4000, damage: 400, xp: 4000, iron: 500, silver: 400, gold: 15 },
  38: { level: 38, mode: '1v1', enemyType: 'Простой', hp: 500, damage: 60, xp: 120, iron: 100, silver: 30, gold: 2 },
  39: { level: 39, mode: '1v1', enemyType: 'Элитный', hp: 800, damage: 120, xp: 300, iron: 150, silver: 60, gold: 5 },
  40: { level: 40, mode: '1v1', enemyType: 'Босс', hp: 2000, damage: 250, xp: 1200, iron: 300, silver: 150, gold: 10 },
  41: { level: 41, mode: '2v2', enemyType: 'Простой', hp: 800, damage: 80, xp: 200, iron: 200, silver: 120, gold: 5 },
  42: { level: 42, mode: '2v2', enemyType: 'Элитный', hp: 1500, damage: 200, xp: 700, iron: 300, silver: 200, gold: 10 },
  43: { level: 43, mode: '2v2', enemyType: 'Босс', hp: 3500, damage: 400, xp: 4000, iron: 500, silver: 300, gold: 15 },
  44: { level: 44, mode: 'squad', enemyType: 'Простой', hp: 900, damage: 90, xp: 300, iron: 300, silver: 200, gold: 5 },
  45: { level: 45, mode: 'squad', enemyType: 'Элитный', hp: 1800, damage: 220, xp: 800, iron: 400, silver: 300, gold: 10 },
  46: { level: 46, mode: 'squad', enemyType: 'Босс', hp: 5000, damage: 500, xp: 5000, iron: 600, silver: 400, gold: 20 },
  47: { level: 47, mode: 'royale', enemyType: 'Мелкий', hp: 600, damage: 60, xp: 120, iron: 120, silver: 150, gold: 5 },
  48: { level: 48, mode: 'royale', enemyType: 'Средний', hp: 1500, damage: 200, xp: 700, iron: 300, silver: 300, gold: 10 },
  49: { level: 49, mode: 'royale', enemyType: 'Босс', hp: 6000, damage: 600, xp: 6000, iron: 700, silver: 500, gold: 25 },
  50: { level: 50, mode: 'royale', enemyType: 'Босс', hp: 10000, damage: 700, xp: 10000, iron: 1000, silver: 700, gold: 50 },
};

export const getBattleTier = (level: number): BattleTier => {
  return BATTLE_TIERS[level] || BATTLE_TIERS[50];
};
