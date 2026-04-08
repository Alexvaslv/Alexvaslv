export interface ItemStats {
  attack?: number;
  defense?: number;
  hp?: number;
  str?: number;
  agi?: number;
  int?: number;
  end?: number;
  intel?: number;
  wis?: number;
}

export interface Item {
  id: string;
  name: string;
  type: string;
  level?: number;
  price?: number;
  stars?: number;
  stats: ItemStats;
}

export type ClanRole = 'leader' | 'deputy' | 'officer' | 'veteran' | 'fighter' | 'rookie';

export interface ClanMember {
  playerId: string;
  username: string;
  role: ClanRole;
  joinedAt: number;
}

export interface Clan {
  id: string;
  name: string;
  level: number;
  xp: number;
  members: ClanMember[];
  power: number;
  achievements: number;
  emblem: number;
  frame: number;
  isEmblemPaid: boolean;
  isFramePaid: boolean;
}
