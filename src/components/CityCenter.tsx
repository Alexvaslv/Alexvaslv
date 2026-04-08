import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  FlaskConical, 
  Stethoscope, 
  Shirt, 
  Sword, 
  Wrench, 
  TrainFront, 
  Gavel, 
  Church, 
  CalendarDays, 
  LogOut,
  Trees,
  Mountain,
  DoorOpen,
  Skull,
  Map as MapIcon,
  ArrowLeft,
  Lock
} from "lucide-react";

type LocationType = 'city' | 'outside';

interface Location {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  minLevel?: number;
}

const CITY_LOCATIONS: Location[] = [
  { id: 'bank', name: 'Банк', icon: Building2, color: 'text-yellow-500', description: 'Хранение золота и вклады' },
  { id: 'pharmacy', name: 'Аптека', icon: FlaskConical, color: 'text-emerald-400', description: 'Эликсиры и зелья' },
  { id: 'hospital', name: 'Больница', icon: Stethoscope, color: 'text-red-400', description: 'Лечение травм и отравлений' },
  { id: 'equip_shop', name: 'Магазин брони', icon: Shirt, color: 'text-blue-400', description: 'Лучшая защита в городе' },
  { id: 'weapon_shop', name: 'Магазин оружия', icon: Sword, color: 'text-orange-500', description: 'Сталь, закаленная в боях' },
  { id: 'repair', name: 'Мастерская', icon: Wrench, color: 'text-slate-400', description: 'Ремонт и заточка снаряжения' },
  { id: 'station', name: 'Вокзал', icon: TrainFront, color: 'text-cyan-400', description: 'Путешествия в другие земли' },
  { id: 'auction', name: 'Аукцион', icon: Gavel, color: 'text-amber-600', description: 'Торговля редкими вещами' },
  { id: 'church', name: 'Церковь', icon: Church, color: 'text-white', description: 'Свадьбы и благословения' },
  { id: 'events', name: 'События', icon: CalendarDays, color: 'text-fuchsia-400', description: 'Расписание приключений' },
];

const MISSION_LOCATIONS: Location[] = [
  { id: 'forest', name: 'Лес', icon: Trees, color: 'text-green-500', description: 'Сюжетная миссия: Глава 1', minLevel: 1 },
  { id: 'cave', name: 'Пещера', icon: Mountain, color: 'text-slate-500', description: 'Сюжетная миссия: Глава 2', minLevel: 5 },
  { id: 'dungeon', name: 'Подземелье', icon: Skull, color: 'text-red-600', description: 'Сюжетная миссия: Глава 3', minLevel: 10 },
  { id: 'mountains', name: 'Горы', icon: MapIcon, color: 'text-blue-200', description: 'Сюжетная миссия: Глава 4', minLevel: 20 },
];

interface CityCenterProps {
  userLevel: number;
  onLocationSelect?: (locationId: string) => void;
  key?: string;
}

export default function CityCenter({ userLevel, onLocationSelect }: CityCenterProps) {
  const [view, setView] = useState<LocationType>('city');
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);

  const handleLocationClick = (loc: Location) => {
    if (loc.minLevel && userLevel < loc.minLevel) return;
    setSelectedLoc(loc.id);
    if (onLocationSelect) onLocationSelect(loc.id);
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6 px-4 pb-32">
      <AnimatePresence mode="wait">
        {view === 'city' ? (
          <motion.div 
            key="city"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Центр Города</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Сердце вашей империи</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CITY_LOCATIONS.map((loc) => (
                <button 
                  key={loc.id}
                  onClick={() => handleLocationClick(loc)}
                  className="bg-gray-900/50 border border-white/10 rounded-3xl p-5 flex flex-col items-center gap-4 hover:bg-gray-800/60 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all group backdrop-blur-xl"
                >
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-105 transition-all ${loc.color}`}>
                    <loc.icon className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">{loc.name}</span>
                    <span className="text-[9px] text-white/40 uppercase tracking-wider text-center leading-tight">{loc.description}</span>
                  </div>
                </button>
              ))}
              
              {/* Exit City Button */}
              <button 
                onClick={() => setView('outside')}
                className="col-span-2 mt-2 bg-red-950/30 border border-red-500/20 rounded-3xl p-6 flex items-center justify-center gap-4 hover:bg-red-900/40 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all group backdrop-blur-xl"
              >
                <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 group-hover:scale-105 transition-all">
                  <LogOut className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-bold uppercase tracking-[0.1em] text-red-500">Выйти из города</span>
                  <span className="text-[10px] text-red-500/50 uppercase tracking-widest">К сюжетным миссиям</span>
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="outside"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-red-500">За Городом</h2>
              <p className="text-[10px] text-red-500/30 uppercase tracking-widest">Опасные земли и приключения</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {MISSION_LOCATIONS.map((loc) => {
                const isLocked = loc.minLevel ? userLevel < loc.minLevel : false;
                return (
                  <button 
                    key={loc.id}
                    onClick={() => handleLocationClick(loc)}
                    disabled={isLocked}
                    className={`bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6 transition-all group backdrop-blur-xl relative overflow-hidden ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/20'}`}
                  >
                    <div className={`p-4 rounded-3xl bg-white/5 border border-white/5 group-hover:scale-110 transition-all ${isLocked ? 'text-white/20' : loc.color}`}>
                      {isLocked ? <Lock className="w-8 h-8" /> : <loc.icon className="w-8 h-8" />}
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black uppercase tracking-widest text-white">{loc.name}</span>
                        {isLocked && (
                          <span className="text-[8px] font-black bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Нужен {loc.minLevel} ур.
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">{loc.description}</span>
                    </div>
                    {!isLocked && (
                      <div className="ml-auto p-2 rounded-full bg-white/5 border border-white/5 text-white/10 group-hover:text-white/40 transition-all">
                        <Sword className="w-4 h-4" />
                      </div>
                    )}
                    
                    {/* Decorative background element */}
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.07] transition-all ${loc.color}`}>
                      <loc.icon className="w-full h-full" />
                    </div>
                  </button>
                );
              })}

              {/* Return to City Button */}
              <button 
                onClick={() => setView('city')}
                className="mt-4 bg-white/10 border border-white/20 rounded-[2rem] p-6 flex items-center justify-center gap-4 hover:bg-white/20 hover:border-white/40 transition-all group backdrop-blur-xl"
              >
                <div className="p-3 rounded-2xl bg-white/10 text-white group-hover:-translate-x-1 transition-all">
                  <ArrowLeft className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Вернуться в город</span>
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">В безопасную зону</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Detail Modal (Placeholder) */}
      <AnimatePresence>
        {selectedLoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedLoc(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-[#111] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center gap-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                <Building2 className="w-10 h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black uppercase tracking-widest text-white">
                  {selectedLoc.charAt(0).toUpperCase() + selectedLoc.slice(1)}
                </h3>
                <p className="text-xs text-white/30 uppercase tracking-widest">В разработке</p>
              </div>
              <button 
                onClick={() => setSelectedLoc(null)}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl"
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
