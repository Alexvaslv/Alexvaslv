export interface BattleTier {
  level: number;
  mode: '1v1' | '2v2' | 'squad' | 'royale';
  enemyType: string;
  hp: number;
  damage: number;
  xp: number;
  silver: number;
  gold: number;
  diamonds: number;
}

export const BATTLE_TIERS: Record<number, BattleTier> = {
  1: { level: 1, mode: '1v1', enemyType: 'Простой', hp: 100, damage: 10, xp: 50, silver: 10, gold: 0, diamonds: 0 },
  2: { level: 2, mode: '1v1', enemyType: 'Простой', hp: 150, damage: 15, xp: 75, silver: 20, gold: 0, diamonds: 0 },
  3: { level: 3, mode: '1v1', enemyType: 'Простой', hp: 200, damage: 20, xp: 100, silver: 30, gold: 0, diamonds: 0 },
  4: { level: 4, mode: '1v1', enemyType: 'Элитный', hp: 300, damage: 30, xp: 150, silver: 50, gold: 1, diamonds: 0 },
  5: { level: 5, mode: '1v1', enemyType: 'Босс', hp: 500, damage: 50, xp: 300, silver: 100, gold: 2, diamonds: 0 },
  6: { level: 6, mode: '2v2', enemyType: 'Простой', hp: 400, damage: 40, xp: 200, silver: 80, gold: 1, diamonds: 0 },
  7: { level: 7, mode: '2v2', enemyType: 'Простой', hp: 500, damage: 50, xp: 250, silver: 100, gold: 1, diamonds: 0 },
  8: { level: 8, mode: '2v2', enemyType: 'Элитный', hp: 700, damage: 70, xp: 400, silver: 150, gold: 3, diamonds: 0 },
  9: { level: 9, mode: '2v2', enemyType: 'Простой', hp: 600, damage: 60, xp: 300, silver: 120, gold: 2, diamonds: 0 },
  10: { level: 10, mode: '2v2', enemyType: 'Босс', hp: 1200, damage: 120, xp: 800, silver: 300, gold: 5, diamonds: 1 },
  11: { level: 11, mode: 'squad', enemyType: 'Простой', hp: 800, damage: 80, xp: 400, silver: 200, gold: 3, diamonds: 0 },
  12: { level: 12, mode: 'squad', enemyType: 'Элитный', hp: 1200, damage: 120, xp: 600, silver: 300, gold: 5, diamonds: 0 },
  13: { level: 13, mode: 'squad', enemyType: 'Простой', hp: 1000, damage: 100, xp: 500, silver: 250, gold: 4, diamonds: 0 },
  14: { level: 14, mode: 'squad', enemyType: 'Элитный', hp: 1500, damage: 150, xp: 800, silver: 400, gold: 6, diamonds: 1 },
  15: { level: 15, mode: 'squad', enemyType: 'Босс', hp: 2500, damage: 250, xp: 1500, silver: 600, gold: 10, diamonds: 2 },
  16: { level: 16, mode: 'royale', enemyType: 'Мелкий', hp: 1200, damage: 120, xp: 600, silver: 300, gold: 5, diamonds: 0 },
  17: { level: 17, mode: 'royale', enemyType: 'Мелкий', hp: 1500, damage: 150, xp: 800, silver: 400, gold: 6, diamonds: 1 },
  18: { level: 18, mode: 'royale', enemyType: 'Средний', hp: 2500, damage: 250, xp: 1500, silver: 600, gold: 10, diamonds: 2 },
  19: { level: 19, mode: 'royale', enemyType: 'Средний', hp: 3000, damage: 300, xp: 2000, silver: 800, gold: 15, diamonds: 3 },
  20: { level: 20, mode: 'royale', enemyType: 'Босс', hp: 5000, damage: 500, xp: 4000, silver: 1500, gold: 30, diamonds: 5 },
};

export const getBattleTier = (level: number): BattleTier => {
  return BATTLE_TIERS[level] || BATTLE_TIERS[20];
};
