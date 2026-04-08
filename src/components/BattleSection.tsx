import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sword, 
  Users, 
  Shield, 
  Zap, 
  Trophy, 
  User, 
  Heart, 
  FlaskConical, 
  Skull,
  Crown,
  ChevronRight,
  Timer
} from "lucide-react";
import { Item } from "../types";
import { getLevelStats, getBattleTier } from "../constants";

type BattleMode = '1v1' | '2v2' | 'squad' | 'royale';
type BattleState = 'idle' | 'searching' | 'fighting' | 'result';

type FighterType = 'warrior' | 'monster' | 'archer' | 'boss';

interface Fighter {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  isBot: boolean;
  team: number;
  type: FighterType;
  damage: number;
}

const BOT_NAMES = ["Тень", "Волк", "Гром", "Мрак", "Сталь", "Клык", "Буря", "Ястреб", "Титан", "Призрак"];
const MONSTER_NAMES = ["Гоблин", "Орк", "Тролль", "Слизень", "Паук"];
const ARCHER_NAMES = ["Стрелок", "Лучник", "Следопыт", "Охотник"];
const BOSS_NAMES = ["Король Лич", "Древний Дракон", "Повелитель Тьмы", "Разрушитель Миров"];

interface BattleSectionProps {
  userLevel: number;
  onVictory: (rewards: { xp: number, copper: number, silver: number, iron: number, items: Item[] }) => void;
  key?: string;
  location?: string;
}

export default function BattleSection({ userLevel, onVictory, location }: BattleSectionProps) {
  const [activeMode, setActiveMode] = useState<BattleMode>('1v1');
  const [state, setState] = useState<BattleState>('idle');
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [turn, setTurn] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [battleRewards, setBattleRewards] = useState<{ xp: number, copper: number, silver: number, iron: number, items: Item[] } | null>(null);

  // Simulated Leaderboard
  const LEADERBOARD = [
    { name: "LegionMaster", power: 15000, wins: 450, level: 50 },
    { name: "ShadowSlayer", power: 14200, wins: 412, level: 48 },
    { name: "IronWill", power: 13800, wins: 398, level: 45 },
    { name: "StormBringer", power: 12500, wins: 350, level: 42 },
    { name: "Phoenix", power: 11000, wins: 310, level: 40 },
  ];

  const startSearch = () => {
    setState('searching');
    setSearchProgress(0);
    setLog([]);
    setWinner(null);
  };

  useEffect(() => {
    if (state === 'searching') {
      const interval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            initBattle();
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [state]);

  const createBot = (level: number, team: number, forcedType?: string): Fighter => {
    const tier = getBattleTier(level);
    let type: FighterType = 'warrior';
    let name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    let hp = tier.hp;
    let damage = tier.damage;
    
    if (forcedType === 'Босс' || tier.enemyType === 'Босс') {
      type = 'boss';
      name = BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)];
    } else if (tier.enemyType === 'Элитный') {
      type = 'monster';
      name = "Элитный " + MONSTER_NAMES[Math.floor(Math.random() * MONSTER_NAMES.length)];
    } else {
      const typeRoll = Math.random();
      if (typeRoll < 0.3) {
        type = 'monster';
        name = MONSTER_NAMES[Math.floor(Math.random() * MONSTER_NAMES.length)];
      } else if (typeRoll < 0.6) {
        type = 'archer';
        name = ARCHER_NAMES[Math.floor(Math.random() * ARCHER_NAMES.length)];
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      hp,
      maxHp: hp,
      level,
      isBot: true,
      team,
      type,
      damage
    };
  };

  const initBattle = () => {
    const playerStats = getLevelStats(userLevel);
    const player: Fighter = { id: 'player', name: 'Вы', hp: playerStats.hp, maxHp: playerStats.hp, level: userLevel, isBot: false, team: 1, type: 'warrior', damage: 20 + userLevel * 5 };
    let opponents: Fighter[] = [];

    const getBotLevel = () => {
      const offset = Math.floor(Math.random() * 3) - 1; // -1 to +1
      return Math.min(50, Math.max(1, userLevel + offset));
    };

    if (activeMode === '1v1') {
      opponents = [createBot(userLevel, 2)];
    } else if (activeMode === '2v2') {
      const ally = createBot(userLevel, 1);
      opponents = [createBot(userLevel, 2), createBot(userLevel, 2)];
      setFighters([player, ally, ...opponents]);
    } else if (activeMode === 'squad') {
      const allies = [createBot(userLevel, 1), createBot(userLevel, 1)];
      opponents = [createBot(userLevel, 2), createBot(userLevel, 2), createBot(userLevel, 2)];
      setFighters([player, ...allies, ...opponents]);
    } else if (activeMode === 'royale') {
      opponents = Array.from({ length: 9 }, (_, i) => createBot(userLevel, i + 2));
      setFighters([player, ...opponents]);
    }

    if (activeMode !== '2v2' && activeMode !== 'squad' && activeMode !== 'royale') {
      setFighters([player, ...opponents]);
    }
    
    setState('fighting');
    setTurn(0);
    addLog("Бой начался!");
  };

  const addLog = (msg: string, isCrit: boolean = false) => {
    setLog(prev => [{ text: msg, isCrit }, ...prev.map(l => typeof l === 'string' ? {text: l, isCrit: false} : l)].slice(0, 20) as any);
  };

  const FUNNY_LOGS = [
    "споткнулся и ударил",
    "чихнул во время атаки на",
    "с криком 'За маму!' ударил",
    "случайно попал по",
    "использовал секретный прием 'Лещ' на"
  ];

  const SAD_LOGS = [
    "с грустью в глазах ранил",
    "вспомнил бывшую и со злости ударил",
    "плача от боли, атаковал",
    "с тяжелым вздохом нанес урон",
    "потеряв надежду, ударил"
  ];

  const handleAction = (action: 'attack' | 'dodge' | 'block' | 'heal' | 'surrender') => {
    if (state !== 'fighting') return;

    if (action === 'surrender') {
      addLog("Вы сдались и ушли с позором...");
      setState('result');
      setWinner(2); // Opponent wins
      return;
    }

    const newFighters = [...fighters];
    const player = newFighters.find(f => f.id === 'player')!;
    
    // Player Turn
    let target: Fighter | undefined;
    if (activeMode === 'royale') {
      target = newFighters.find(f => f.team !== player.team && f.hp > 0);
    } else {
      target = newFighters.find(f => f.team === 2 && f.hp > 0);
    }

    if (!target) return;

    if (action === 'attack') {
      const isCrit = Math.random() < 0.2; // 20% crit chance
      const baseDmg = player.damage + Math.floor(Math.random() * 10);
      const dmg = isCrit ? baseDmg * 2 : baseDmg;
      target.hp = Math.max(0, target.hp - dmg);
      
      const logType = Math.random();
      let actionText = "нанесли";
      if (logType < 0.3) actionText = FUNNY_LOGS[Math.floor(Math.random() * FUNNY_LOGS.length)];
      else if (logType < 0.6) actionText = SAD_LOGS[Math.floor(Math.random() * SAD_LOGS.length)];
      
      addLog(`Вы ${actionText} ${dmg} урона ${target.name}`, isCrit);
    } else if (action === 'heal') {
      const heal = Math.floor(player.maxHp * 0.3);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      addLog(`Вы выпили эликсир и восстановили ${heal} HP`);
    } else if (action === 'block') {
      addLog(`Вы встали в блок`);
    } else if (action === 'dodge') {
      addLog(`Вы приготовились к увороту`);
    }

    // Check if battle ended
    if (checkVictory(newFighters)) return;

    // Bots Turn (simulated delay)
    if (state === 'fighting') {
      setTimeout(() => {
        const aliveBots = newFighters.filter(f => f.isBot && f.hp > 0);
        aliveBots.forEach(bot => {
          const botTarget = newFighters.find(f => f.team !== bot.team && f.hp > 0);
          if (botTarget) {
            let baseDmg = bot.damage + Math.floor(Math.random() * 5);
            let logMsg = `${bot.name} нанес ${baseDmg} урона ${botTarget.name}`;
            
            if (bot.type === 'monster' || bot.type === 'boss') {
              logMsg = `${bot.name} яростно атаковал ${botTarget.name}, нанеся ${baseDmg} урона!`;
            } else if (bot.type === 'archer') {
              if (Math.random() < 0.3) {
                baseDmg *= 2; // Archer has a chance to shoot a piercing arrow
                logMsg = `${bot.name} выпустил пронзающую стрелу в ${botTarget.name}, нанеся ${baseDmg} урона!`;
              } else {
                logMsg = `${bot.name} выстрелил в ${botTarget.name}, нанеся ${baseDmg} урона!`;
              }
            }

            botTarget.hp = Math.max(0, botTarget.hp - baseDmg);
            addLog(logMsg, false);
          }
        });
        setFighters([...newFighters]);
        checkVictory(newFighters);
      }, 500);
    }

    setFighters(newFighters);
    setTurn(prev => prev + 1);
  };

  const checkVictory = (currentFighters: Fighter[]) => {
    const teamsAlive = new Set(currentFighters.filter(f => f.hp > 0).map(f => f.team));
    if (teamsAlive.size <= 1) {
      setState('result');
      const winTeam = Array.from(teamsAlive)[0] || null;
      setWinner(winTeam);
      
      if (winTeam === 1) {
        // Give rewards based on level and tier
        const tier = getBattleTier(userLevel);
        const xp = tier.xp;
        const copper = 0; // Replaced by silver/gold in higher tiers, but kept for compatibility if needed. Let's give some random copper.
        const silver = tier.silver;
        const iron = tier.iron;
        const gold = tier.gold;
        
        let items: Item[] = [];
        if (userLevel <= 10 && Math.random() > 0.5) {
          const beginnerItems: Item[] = [
            { id: Math.random().toString(), name: "Ржавый меч", type: 'weapon', stats: { attack: 2 } },
            { id: Math.random().toString(), name: "Старая куртка", type: 'armor', stats: { defense: 2, hp: 10 } },
            { id: Math.random().toString(), name: "Малое зелье", type: 'elixir', stats: { hp: 50 } },
            { id: Math.random().toString(), name: "Деревянный щит", type: 'armor', stats: { defense: 3 } }
          ];
          items.push(beginnerItems[Math.floor(Math.random() * beginnerItems.length)]);
        }
        
        const rewards = { xp, copper: Math.floor(Math.random() * 50), silver, iron, items };
        setBattleRewards(rewards);
        onVictory(rewards);
      } else {
        setBattleRewards(null);
      }
      return true;
    }
    return false;
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6 px-4 pb-32">
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Арена</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Докажи свое превосходство</p>
            </div>

            {/* Battle Modes */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '1v1', name: 'Дуэль 1х1', icon: User, color: 'text-blue-400' },
                { id: '2v2', name: 'Битва 2х2', icon: Users, color: 'text-emerald-400' },
                { id: 'squad', name: 'Отряды', icon: Shield, color: 'text-orange-500' },
                { id: 'royale', name: 'Королевская битва', icon: Crown, color: 'text-yellow-500' },
              ].map((mode) => (
                <button 
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id as BattleMode)}
                  className={`bg-white/5 border rounded-[2rem] p-5 flex flex-col items-center gap-3 transition-all group backdrop-blur-xl ${activeMode === mode.id ? 'border-white/40 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-all ${mode.color}`}>
                    <mode.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{mode.name}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={startSearch}
              className="w-full bg-white text-black font-black uppercase tracking-[0.3em] py-5 rounded-[2rem] hover:bg-white/90 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <Sword className="w-5 h-5" />
              Вступить в бой
            </button>

            {/* Leaderboard Preview */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Топ игроков</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/10" />
              </div>
              <div className="flex flex-col gap-2">
                {LEADERBOARD.map((player, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-white/20">#{i+1}</span>
                      <span className="text-xs font-bold text-white">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-white/10 uppercase">Уровень</span>
                        <span className="text-[10px] font-bold text-blue-400">{player.level}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-white/10 uppercase">Побед</span>
                        <span className="text-[10px] font-bold text-emerald-400">{player.wins}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {state === 'searching' && (
          <motion.div 
            key="searching"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center py-20 gap-8"
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-white/5 border-t-white rounded-full"
              />
              <Sword className="w-12 h-12 text-white/20" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white">Поиск противников</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Подбор игроков для {activeMode}...</p>
            </div>
            <div className="w-full max-w-[200px] h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${searchProgress}%` }}
              />
            </div>
          </motion.div>
        )}

        {state === 'fighting' && (
          <motion.div 
            key="fighting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            {/* Battle Arena UI */}
            <div className="grid grid-cols-2 gap-4 h-[200px]">
              {/* Team 1 */}
              <div className="flex flex-col gap-1 justify-center overflow-y-auto max-h-[200px] pr-2">
                {fighters.filter(f => f.team === 1).map(f => (
                  <div key={f.id} className={`p-2 rounded-xl border transition-all ${f.hp <= 0 ? 'opacity-30 bg-red-900/10 border-red-500/10' : 'bg-white/5 border-white/10 shadow-lg'}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] font-black uppercase text-white truncate w-16">{f.name}</span>
                      <span className="text-[7px] text-white/30">{f.hp}/{f.maxHp} HP</span>
                    </div>
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-emerald-500"
                        initial={{ width: "100%" }}
                        animate={{ width: `${(f.hp / f.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Team 2+ (Opponents) */}
              <div className="flex flex-col gap-1 justify-start overflow-y-auto max-h-[200px] pr-2">
                {fighters.filter(f => f.team !== 1).map(f => (
                  <div key={f.id} className={`p-2 rounded-xl border transition-all flex-shrink-0 ${f.hp <= 0 ? 'opacity-30 bg-red-900/10 border-red-500/10' : 'bg-red-500/5 border-red-500/10 shadow-lg'}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] font-black uppercase text-white truncate w-16">{f.name}</span>
                      <span className="text-[7px] text-white/30">{f.hp}/{f.maxHp} HP</span>
                    </div>
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-red-500"
                        initial={{ width: "100%" }}
                        animate={{ width: `${(f.hp / f.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Battle Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleAction('attack')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg"
              >
                <Sword className="w-4 h-4" />
                Удар
              </button>
              <button 
                onClick={() => handleAction('block')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg"
              >
                <Shield className="w-4 h-4" />
                Блок
              </button>
              <button 
                onClick={() => handleAction('dodge')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-orange-600 text-white font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg"
              >
                <Zap className="w-4 h-4" />
                Уворот
              </button>
              <button 
                onClick={() => handleAction('heal')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg"
              >
                <FlaskConical className="w-4 h-4" />
                Зелье
              </button>
              <button 
                onClick={() => handleAction('surrender')}
                className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 font-black uppercase tracking-widest hover:bg-white/10 hover:text-white/80 transition-all text-[10px]"
              >
                Сдаться и уйти с позором
              </button>
            </div>

            {/* Battle Log */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 h-32 flex flex-col gap-1 overflow-y-auto">
              {log.map((msg: any, i) => (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`text-[10px] font-bold uppercase tracking-wider ${i === 0 ? (msg.isCrit ? 'text-red-400 font-black scale-105 origin-left' : 'text-white') : 'text-white/20'}`}
                >
                  {msg.isCrit && i === 0 && <span className="text-red-500 mr-1">КРИТ!</span>}
                  {msg.text || msg}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 gap-8"
          >
            <div className={`w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center shadow-2xl ${winner === 1 ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500' : 'bg-red-500/10 border-red-500/40 text-red-500'}`}>
              {winner === 1 ? <Crown className="w-12 h-12" /> : <Skull className="w-12 h-12" />}
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className={`text-3xl font-black uppercase tracking-[0.3em] ${winner === 1 ? 'text-yellow-500' : 'text-red-500'}`}>
                {winner === 1 ? 'Победа!' : 'Поражение'}
              </h3>
              {winner === 1 && battleRewards ? (
                <div className="relative flex flex-col gap-1 text-xs text-white/60 uppercase tracking-widest mt-2 p-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-bright-line-scan" />
                  <p className="text-yellow-400 font-bold">Получено опыта: +{battleRewards.xp}%</p>
                  <p>Медь: {battleRewards.copper} | Серебро: {battleRewards.silver} | Железо: {battleRewards.iron}</p>
                  {battleRewards.items.length > 0 && (
                    <p className="text-emerald-400 mt-1">Найдено: {battleRewards.items.map(i => i.name).join(', ')}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-white/30 uppercase tracking-widest mt-2">
                  Вы потеряли немного гордости
                </p>
              )}
            </div>
            <button 
              onClick={() => setState('idle')}
              className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-all"
            >
              Вернуться
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
