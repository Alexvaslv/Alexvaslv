import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Plus, Users, Trophy, ChevronRight, Search, Sword, Crown, Flame, Skull, Ghost, Heart, Star, Zap, Moon, Sun, Anchor, Diamond, Gem, Hexagon, Circle, Square, Hash, Home, Box, User, Settings, LogOut, MessageSquare, Target, Map, Activity } from "lucide-react";
import { Clan, ClanMember, ClanRole } from "../types";
import { CLAN_LEVELS, CLAN_ROLES } from "../constants/clan";
import { formatNumber } from "../constants";

const MOCK_CLANS: Clan[] = [
  { 
    id: "10293", name: "Legion", level: 10, xp: 115000, members: [], power: 1250000, achievements: 120,
    emblem: 0, frame: 0, isEmblemPaid: false, isFramePaid: false
  },
  { 
    id: "98765", name: "Phoenix", level: 9, xp: 85000, members: [], power: 1180000, achievements: 115,
    emblem: 1, frame: 1, isEmblemPaid: false, isFramePaid: false
  },
  { 
    id: "56473", name: "Shadows", level: 8, xp: 60000, members: [], power: 950000, achievements: 85,
    emblem: 2, frame: 2, isEmblemPaid: false, isFramePaid: false
  },
  { 
    id: "19283", name: "Titans", level: 25, xp: 2500000, members: [], power: 5500000, achievements: 350,
    emblem: 0, frame: 0, isEmblemPaid: true, isFramePaid: true
  },
  { 
    id: "12345", name: "Dragons", level: 5, xp: 12000, members: [], power: 500000, achievements: 40,
    emblem: 1, frame: 0, isEmblemPaid: false, isFramePaid: false
  },
];

const FREE_EMBLEMS = [Shield, Sword, Trophy];
const PAID_EMBLEMS = [Crown, Flame, Skull, Ghost, Heart, Star, Zap, Moon, Sun, Anchor];

const FREE_FRAMES = ["border-white/20", "border-double border-white/40", "border-dashed border-white/30"];
const PAID_FRAMES = [
  "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.5)] text-yellow-500 animate-pulse-glow",
  "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] text-cyan-500 animate-pulse-glow",
  "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] text-purple-500 animate-pulse-glow",
  "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] text-red-500 animate-pulse-glow",
  "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.5)] text-green-500 animate-pulse-glow",
  "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.5)] text-orange-500 animate-pulse-glow",
  "border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.5)] text-pink-500 animate-pulse-glow",
  "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-blue-500 animate-pulse-glow",
  "border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] text-indigo-500 animate-pulse-glow",
  "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-emerald-500 animate-pulse-glow"
];

const getClanNameStyle = (level: number) => {
  if (level === 5) return "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse";
  if (level === 6) return "bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text animate-gradient-x drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]";
  if (level === 7) return "bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-text-shine drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]";
  if (level === 8) return "text-yellow-400 animate-float-subtle drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]";
  if (level === 9) return "text-white animate-fire-glow";
  if (level === 10) return "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-transparent bg-clip-text animate-rainbow-glow tracking-widest";
  return "text-white";
};

type ClanSubTab = 'list' | 'create' | 'rating';

interface ClanSectionProps {
  currentClan: string | null;
  onJoinClan?: (clanName: string) => void;
  onCreateClan?: (clanName: string) => void;
  onLeaveClan?: () => void;
}

export default function ClanSection({ currentClan, onJoinClan, onCreateClan, onLeaveClan }: ClanSectionProps) {
  const [subTab, setSubTab] = useState<ClanSubTab>('list');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create Clan State
  const [newClanName, setNewClanName] = useState("");
  const [selectedEmblem, setSelectedEmblem] = useState(0);
  const [isEmblemPaid, setIsEmblemPaid] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [isFramePaid, setIsFramePaid] = useState(false);

  const filteredClans = MOCK_CLANS.filter(clan => 
    clan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedByPower = [...MOCK_CLANS].sort((a, b) => b.power - a.power);
  const sortedByLevel = [...MOCK_CLANS].sort((a, b) => b.level - a.level);
  const sortedByAchievements = [...MOCK_CLANS].sort((a, b) => b.achievements - a.achievements);

  const CurrentEmblemIcon = isEmblemPaid ? PAID_EMBLEMS[selectedEmblem] : FREE_EMBLEMS[selectedEmblem];
  const currentFrameStyle = isFramePaid ? PAID_FRAMES[selectedFrame] : FREE_FRAMES[selectedFrame];

  if (currentClan && currentClan !== "Новичок") {
    const clanData = MOCK_CLANS.find(c => c.name === currentClan) || MOCK_CLANS[0];
    const clanLevelData = CLAN_LEVELS.find(l => l.level === clanData.level) || CLAN_LEVELS[0];
    const nextLevelData = CLAN_LEVELS.find(l => l.level === clanData.level + 1);
    const xpProgress = nextLevelData ? (clanData.xp / nextLevelData.xpRequired) * 100 : 100;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col gap-4 px-2 pb-32"
      >
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-6 flex flex-col items-center gap-4 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/20 to-transparent opacity-50" />
          
          <div className={`relative w-24 h-24 rounded-3xl bg-[#0a0a0a] flex items-center justify-center shadow-xl z-10 ${currentFrameStyle}`}>
            <CurrentEmblemIcon className="w-12 h-12" />
          </div>
          
          <div className="text-center z-10">
            <h2 className={`text-3xl font-black uppercase tracking-widest ${getClanNameStyle(clanData.level)}`}>
              {clanData.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] font-bold text-white/80 uppercase tracking-wider">
                Уровень {clanData.level}
              </span>
              <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] font-bold text-white/80 uppercase tracking-wider">
                Рейтинг: {clanData.power.toLocaleString()}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="w-full flex flex-col gap-1 mt-2 z-10">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/60">
              <span>Опыт клана</span>
              <span>{clanData.xp.toLocaleString()} / {nextLevelData ? nextLevelData.xpRequired.toLocaleString() : 'MAX'}</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <Users className="w-6 h-6 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Участники</span>
            <span className="text-lg font-bold text-white">{clanData.members.length || 1}/{clanLevelData.maxMembers}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Достижения</span>
            <span className="text-lg font-bold text-white">{clanData.achievements}</span>
          </div>
        </div>

        {/* Active Bonuses */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/80 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Активные бонусы
          </h3>
          <div className="flex flex-wrap gap-2">
            {CLAN_LEVELS.filter(l => l.level <= clanData.level).map((l, idx) => (
              <span key={idx} className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                {l.bonus}
              </span>
            ))}
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Чат клана</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <Box className="w-6 h-6 text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Склад ({clanLevelData.storage})</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
            <Sword className="w-6 h-6 text-red-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Войны</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
            <Target className="w-6 h-6 text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Боссы</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
            <Activity className="w-6 h-6 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Миссии</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
            <Map className="w-6 h-6 text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Территории</span>
          </button>
        </div>

        {/* Member List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Участники</h3>
            <button className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300">
              Управление
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/60" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Вы</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${CLAN_ROLES.leader.color}`}>
                    {CLAN_ROLES.leader.label}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-white/40">Онлайн</div>
            </div>
            {/* Mock other members */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-white/60" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Player2</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${CLAN_ROLES.deputy.color}`}>
                    {CLAN_ROLES.deputy.label}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-white/40">2ч назад</div>
            </div>
          </div>
        </div>

        {/* Settings & Leave */}
        <div className="flex gap-3">
          <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <Settings className="w-5 h-5 text-white/60" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Настройки</span>
          </button>
          <button 
            onClick={() => {
              if (confirm("Вы уверены, что хотите покинуть клан?")) {
                onLeaveClan && onLeaveClan();
              }
            }}
            className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md flex flex-col gap-6 px-4 pb-32"
    >
      {/* Clan XP Info */}
      <div className="w-full p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl text-center">
        <p className="text-[9px] text-white/60 uppercase tracking-widest leading-relaxed">
          Опыт клана растет от клановых войн, улучшения построек, выполнения целей и заданий, а также от убийств драконов.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-xl">
        <button 
          onClick={() => setSubTab('list')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'list' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Список
        </button>
        <button 
          onClick={() => setSubTab('create')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'create' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Создать
        </button>
        <button 
          onClick={() => setSubTab('rating')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'rating' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Рейтинг
        </button>
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Поиск клана..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
              />
            </div>

            {/* Clan List */}
            <div className="flex flex-col gap-3">
              {filteredClans.map((clan) => {
                const clanLevelData = CLAN_LEVELS.find(l => l.level === clan.level) || CLAN_LEVELS[0];
                const EmblemIcon = clan.isEmblemPaid ? PAID_EMBLEMS[clan.emblem] : FREE_EMBLEMS[clan.emblem];
                const frameStyle = clan.isFramePaid ? PAID_FRAMES[clan.frame] : FREE_FRAMES[clan.frame];
                
                return (
                  <div key={clan.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-[#0a0a0a] border flex items-center justify-center text-white/40 group-hover:text-white transition-all ${frameStyle}`}>
                        <EmblemIcon className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-black uppercase tracking-wider ${getClanNameStyle(clan.level)}`}>{clan.name}</span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/30">
                          <span className="flex items-center gap-0.5"><Hash className="w-3 h-3" /> {clan.id}</span>
                          <span>•</span>
                          <span>{clan.level} lvl</span>
                          <span>•</span>
                          <span>{clan.members.length || 1}/{clanLevelData.maxMembers}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">Сила</span>
                        <span className="text-xs font-bold text-white/60">{(clan.power / 1000000).toFixed(1)}M</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onJoinClan) {
                            onJoinClan(clan.name);
                            alert(`Вы подали заявку в клан ${clan.name}`);
                          }
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all ml-2"
                      >
                        Вступить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {subTab === 'create' && (
          <motion.div 
            key="create"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={`w-24 h-24 rounded-3xl bg-white/5 border-2 flex items-center justify-center text-white/60 shadow-2xl transition-all duration-500 ${currentFrameStyle}`}>
                  <CurrentEmblemIcon className={`w-12 h-12 ${isEmblemPaid ? 'animate-float-subtle text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]' : ''}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Создать клан</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Настройте свой герб</p>
                </div>
              </div>

              {/* Emblem Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Выберите герб</span>
                <div className="flex flex-col gap-4">
                  {/* Free Emblems */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] font-black text-white/10 uppercase ml-2">Бесплатные</span>
                    <div className="grid grid-cols-5 gap-2">
                      {FREE_EMBLEMS.map((Icon, i) => (
                        <button 
                          key={i}
                          onClick={() => { setSelectedEmblem(i); setIsEmblemPaid(false); }}
                          className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${!isEmblemPaid && selectedEmblem === i ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Paid Emblems */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] font-black text-yellow-500/20 uppercase ml-2">Премиум (100 💎)</span>
                    <div className="grid grid-cols-5 gap-2">
                      {PAID_EMBLEMS.map((Icon, i) => (
                        <button 
                          key={i}
                          onClick={() => { setSelectedEmblem(i); setIsEmblemPaid(true); }}
                          className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${isEmblemPaid && selectedEmblem === i ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500' : 'bg-white/5 border-white/5 text-yellow-500/50 hover:bg-white/10'}`}
                        >
                          <Icon className="w-5 h-5 animate-float-subtle" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame Selection */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Выберите рамку</span>
                <div className="flex flex-col gap-4">
                  {/* Free Frames */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] font-black text-white/10 uppercase ml-2">Бесплатные</span>
                    <div className="grid grid-cols-5 gap-2">
                      {FREE_FRAMES.map((style, i) => (
                        <button 
                          key={i}
                          onClick={() => { setSelectedFrame(i); setIsFramePaid(false); }}
                          className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${!isFramePaid && selectedFrame === i ? 'bg-white/20 border-white/60' : 'bg-white/5 border-white/10 hover:bg-white/10'} ${style}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Paid Frames */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] font-black text-cyan-500/20 uppercase ml-2">Премиум (150 💎)</span>
                    <div className="grid grid-cols-5 gap-2">
                      {PAID_FRAMES.map((style, i) => (
                        <button 
                          key={i}
                          onClick={() => { setSelectedFrame(i); setIsFramePaid(true); }}
                          className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${isFramePaid && selectedFrame === i ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'} ${style}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Название</span>
                  <input 
                    type="text" 
                    value={newClanName}
                    onChange={(e) => setNewClanName(e.target.value)}
                    placeholder="Введите название..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Девиз</span>
                  <textarea 
                    placeholder="Девиз клана..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all h-24 resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    if (newClanName.trim() && onCreateClan) {
                      onCreateClan(newClanName.trim());
                      alert(`Клан ${newClanName} успешно создан!`);
                    } else if (!newClanName.trim()) {
                      alert('Введите название клана');
                    }
                  }}
                  className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-white/90 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Создать (1000 <Diamond className="w-4 h-4" />)
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[8px] font-black text-white/10 uppercase">или</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <button 
                  onClick={() => {
                    if (newClanName.trim() && onCreateClan) {
                      onCreateClan(newClanName.trim());
                      alert(`Клан ${newClanName} успешно создан!`);
                    } else if (!newClanName.trim()) {
                      alert('Введите название клана');
                    }
                  }}
                  className="w-full bg-fuchsia-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-fuchsia-500 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Создать (50 <Gem className="w-4 h-4" />)
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {subTab === 'rating' && (
          <motion.div 
            key="rating"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            {/* Rating Categories */}
            <div className="flex flex-col gap-8">
              {/* By Power */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-2">
                  <Sword className="w-4 h-4 text-red-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">По силе участников</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {sortedByPower.slice(0, 3).map((clan, i) => (
                    <div key={clan.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>#{i + 1}</span>
                        <span className={`text-sm font-bold ${getClanNameStyle(clan.level)}`}>{clan.name}</span>
                      </div>
                      <span className="text-xs font-black text-white/40">{(clan.power / 1000000).toFixed(1)}M Power</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Level */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">По уровню</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {sortedByLevel.slice(0, 3).map((clan, i) => (
                    <div key={clan.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>#{i + 1}</span>
                        <span className={`text-sm font-bold ${getClanNameStyle(clan.level)}`}>{clan.name}</span>
                      </div>
                      <span className="text-xs font-black text-white/40">{clan.level} lvl</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Achievements */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">По достижениям</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {sortedByAchievements.slice(0, 3).map((clan, i) => (
                    <div key={clan.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-orange-400'}`}>#{i + 1}</span>
                        <span className={`text-sm font-bold ${getClanNameStyle(clan.level)}`}>{clan.name}</span>
                      </div>
                      <span className="text-xs font-black text-white/40">{clan.achievements} 🏆</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
