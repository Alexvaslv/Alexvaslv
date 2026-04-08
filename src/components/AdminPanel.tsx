import { useState } from "react";
import { motion } from "motion/react";
import { Shield, User, Users, AlertTriangle, MessageSquareOff, Snowflake, Ban, Trash2, CheckCircle, Crown, ShieldAlert, LifeBuoy, Star, Coins, Diamond, Box, Gem, Skull } from "lucide-react";

interface AdminPanelProps {
  onAddResources: (type: string, amount: number) => void;
  onSetLevel: (level: number) => void;
  onHardReset: () => void;
  currentUser: string;
  currentClan: string;
}

export default function AdminPanel({ onAddResources, onSetLevel, onHardReset, currentUser, currentClan }: AdminPanelProps) {
  const [targetType, setTargetType] = useState<'hero' | 'clan'>('hero');
  const [targetName, setTargetName] = useState(currentUser);
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [levelValue, setLevelValue] = useState(1);

  const handleAction = (action: string) => {
    alert(`Действие "${action}" применено к ${targetType === 'hero' ? 'герою' : 'клану'} "${targetName}"`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Админ-панель</h3>
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            <button 
              onClick={() => { setTargetType('hero'); setTargetName(currentUser); }}
              className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${targetType === 'hero' ? 'bg-white/10 text-white' : 'text-white/30'}`}
            >
              Герой
            </button>
            <button 
              onClick={() => { setTargetType('clan'); setTargetName(currentClan); }}
              className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${targetType === 'clan' ? 'bg-white/10 text-white' : 'text-white/30'}`}
            >
              Клан
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Цель</span>
          <input 
            type="text" 
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-white/30 transition-all"
          />
        </div>

        {/* Punishments */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => handleAction('Предупреждение')} className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 text-yellow-500 transition-all">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Варн</span>
          </button>
          <button onClick={() => handleAction('Мут на месяц')} className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 text-orange-500 transition-all">
            <MessageSquareOff className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Мут (мес)</span>
          </button>
          <button onClick={() => handleAction('Заморозка на год')} className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 hover:bg-cyan-500/10 text-cyan-500 transition-all">
            <Snowflake className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Фриз (год)</span>
          </button>
          <button onClick={() => handleAction('Бан на 10 лет')} className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-500 transition-all">
            <Ban className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Бан (10л)</span>
          </button>
          <button onClick={() => handleAction('Удаление')} className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600/10 border border-red-600/20 hover:bg-red-600/20 text-red-600 transition-all">
            <Trash2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Удалить</span>
          </button>
        </div>

        {/* Global Wipe */}
        <div className="mt-4">
          <button 
            onClick={onHardReset} 
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-900/40 border border-red-500/50 hover:bg-red-900/60 text-red-400 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] group"
          >
            <Skull className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Глобальный вайп (Обнулить всё)</span>
          </button>
        </div>

        {/* Roles & Statuses */}
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Привилегии</span>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => handleAction('Верификация')} title="Верификация" className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 text-blue-500 flex justify-center"><CheckCircle className="w-5 h-5" /></button>
            <button onClick={() => handleAction('Админ')} title="Админ" className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-500 flex justify-center"><Crown className="w-5 h-5" /></button>
            <button onClick={() => handleAction('Модератор')} title="Модератор" className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 text-green-500 flex justify-center"><ShieldAlert className="w-5 h-5" /></button>
            <button onClick={() => handleAction('Поддержка')} title="Поддержка" className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 text-purple-500 flex justify-center"><LifeBuoy className="w-5 h-5" /></button>
          </div>
        </div>

        {/* VIP Statuses */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">VIP Статусы</span>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleAction('VIP Бронза')} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-orange-900/10 border border-orange-900/20 hover:bg-orange-900/20 text-orange-700">
              <Star className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Бронза</span>
            </button>
            <button onClick={() => handleAction('VIP Серебро')} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-400/10 border border-slate-400/20 hover:bg-slate-400/20 text-slate-400">
              <Star className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Серебро</span>
            </button>
            <button onClick={() => handleAction('VIP Золото')} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-500">
              <Star className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Золото</span>
            </button>
          </div>
        </div>

        {/* Economy & Level */}
        <div className="flex flex-col gap-4 mt-2 p-4 rounded-2xl bg-black/20 border border-white/5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Ресурсы</span>
              <input 
                type="number" 
                placeholder="Кол-во..." 
                value={moneyAmount || ''}
                onChange={(e) => setMoneyAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-white/30 transition-all"
              />
              <div className="flex gap-1 mt-1">
                <button onClick={() => setMoneyAmount(10000)} className="flex-1 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-black text-white/60 transition-all">10k</button>
                <button onClick={() => setMoneyAmount(100000)} className="flex-1 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-black text-white/60 transition-all">100k</button>
                <button onClick={() => setMoneyAmount(1000000)} className="flex-1 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-black text-white/60 transition-all">1m</button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Уровень (max 50)</span>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="1"
                  max="50"
                  value={levelValue}
                  onChange={(e) => setLevelValue(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-white/30 transition-all"
                />
                <button 
                  onClick={() => onSetLevel(levelValue)}
                  className="px-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/80 transition-all"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onAddResources('copper', moneyAmount)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-orange-700/10 border border-orange-700/20 hover:bg-orange-700/20 text-orange-700"><Coins className="w-4 h-4" /></button>
            <button onClick={() => onAddResources('silver', moneyAmount)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-300/10 border border-slate-300/20 hover:bg-slate-300/20 text-slate-300"><Coins className="w-4 h-4" /></button>
            <button onClick={() => onAddResources('gold', moneyAmount)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-500"><Coins className="w-4 h-4" /></button>
            <button onClick={() => onAddResources('diamonds', moneyAmount)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/20 text-cyan-400"><Diamond className="w-4 h-4" /></button>
            <button onClick={() => onAddResources('iron', moneyAmount)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-600/10 border border-slate-600/20 hover:bg-slate-600/20 text-slate-600"><Box className="w-4 h-4" /></button>
            <button onClick={() => onAddResources('gems', moneyAmount)} className="flex items-center justify-center gap-2 p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 text-fuchsia-500"><Gem className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
