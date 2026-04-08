import { motion } from "motion/react";
import { Item } from "../types";
import { Sword, Shield, FlaskConical, Book, X, Info } from "lucide-react";

interface ItemModalProps {
  item: Item;
  context: 'backpack' | 'equipped';
  onClose: () => void;
  onEquip?: (item: Item) => void;
  onUnequip?: (item: Item) => void;
  onDismantle?: (item: Item) => void;
  onDiscard?: (item: Item) => void;
  onStore?: (item: Item) => void;
  onClanStore?: (item: Item) => void;
}

export default function ItemModal({ 
  item, 
  context, 
  onClose, 
  onEquip, 
  onUnequip, 
  onDismantle, 
  onDiscard, 
  onStore, 
  onClanStore 
}: ItemModalProps) {
  
  const getIcon = () => {
    switch (item.type) {
      case 'weapon': return <Sword className="w-8 h-8 text-white/80" />;
      case 'armor': return <Shield className="w-8 h-8 text-white/80" />;
      case 'elixir': return <FlaskConical className="w-8 h-8 text-white/80" />;
      case 'book': return <Book className="w-8 h-8 text-white/80" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'weapon': return 'Оружие';
      case 'armor': return 'Доспехи';
      case 'elixir': return 'Эликсир';
      case 'book': return 'Книга';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-6 shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>

        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
            {getIcon()}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black uppercase tracking-widest text-white">{item.name}</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{getTypeLabel()}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-white/40" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Характеристики</span>
          </div>
          {item.stats.attack && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Атака</span>
              <span className="text-xs font-bold text-red-400">+{item.stats.attack}</span>
            </div>
          )}
          {item.stats.defense && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Защита</span>
              <span className="text-xs font-bold text-blue-400">+{item.stats.defense}</span>
            </div>
          )}
          {item.stats.hp && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Здоровье</span>
              <span className="text-xs font-bold text-emerald-400">+{item.stats.hp}</span>
            </div>
          )}
          {item.stats.str && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Сила</span>
              <span className="text-xs font-bold text-emerald-400">+{item.stats.str}</span>
            </div>
          )}
          {item.stats.agi && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Ловкость</span>
              <span className="text-xs font-bold text-emerald-400">+{item.stats.agi}</span>
            </div>
          )}
          {item.stats.int && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Интуиция</span>
              <span className="text-xs font-bold text-emerald-400">+{item.stats.int}</span>
            </div>
          )}
          {item.stats.end && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Выносливость</span>
              <span className="text-xs font-bold text-emerald-400">+{item.stats.end}</span>
            </div>
          )}
          {item.stats.intel && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Интеллект</span>
              <span className="text-xs font-bold text-emerald-400">+{item.stats.intel}</span>
            </div>
          )}
          {item.stats.wis && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Мудрость</span>
              <span className="text-xs font-bold text-emerald-400">+{item.stats.wis}</span>
            </div>
          )}
          {Object.keys(item.stats).length === 0 && (
            <span className="text-xs text-white/40 italic">Нет характеристик</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {context === 'backpack' ? (
            <>
              <button 
                onClick={() => onEquip && onEquip(item)}
                className="w-full py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all text-xs"
              >
                Надеть
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onStore && onStore(item)}
                  className="py-3 bg-blue-500/10 text-blue-400 font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500/20 transition-all text-[10px]"
                >
                  На склад
                </button>
                <button 
                  onClick={() => onClanStore && onClanStore(item)}
                  className="py-3 bg-purple-500/10 text-purple-400 font-bold uppercase tracking-widest rounded-xl hover:bg-purple-500/20 transition-all text-[10px]"
                >
                  В клан
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onDismantle && onDismantle(item)}
                  className="py-3 bg-orange-500/10 text-orange-400 font-bold uppercase tracking-widest rounded-xl hover:bg-orange-500/20 transition-all text-[10px]"
                >
                  Разобрать
                </button>
                <button 
                  onClick={() => onDiscard && onDiscard(item)}
                  className="py-3 bg-red-500/10 text-red-400 font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all text-[10px]"
                >
                  Выбросить
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => onUnequip && onUnequip(item)}
              className="w-full py-3 bg-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all text-xs"
            >
              Снять
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
