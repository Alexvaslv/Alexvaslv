import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, FlaskConical, Sword, Shield, Train, Church, Hammer, HeartPulse, Gavel, X, ChevronLeft, Coins, ArrowRight, ShieldPlus, Zap } from 'lucide-react';
import { WEAPON_TYPES, ARMOR_TYPES, ITEM_LEVELS, generateItems } from '../utils/itemGenerator';

interface CitySectionProps {
  resources: Record<string, number>;
  setResources: (res: any) => void;
  bankAccount: { isOpen: boolean, pin: string, balance: number, loan: number };
  setBankAccount: (acc: any) => void;
  currentCity: string;
  setCurrentCity: (city: string) => void;
  injuries: number;
  setInjuries: (inj: number) => void;
  onGlobalMessage: (msg: string) => void;
  blessing: { active: boolean, expiresAt: number | null };
  setBlessing: (bless: any) => void;
  inventory: any[];
  setInventory: (inv: any[]) => void;
  equippedItems: any;
  setEquippedItems: (eq: any) => void;
  buffStats: any;
  setBuffStats: (stats: any) => void;
}

const CITIES = [
  { name: 'Avalon', icon: Shield }, { name: 'Eldoria', icon: Zap }, { name: 'Ironhold', icon: Hammer },
  { name: 'Stormwatch', icon: Sword }, { name: 'Silvermoon', icon: ShieldPlus }, { name: 'Sunforge', icon: FlaskConical },
  { name: 'Dragonroost', icon: HeartPulse }, { name: 'Shadowfall', icon: Gavel }, { name: 'Kingslanding', icon: Landmark },
  { name: 'Winterfell', icon: Church }
];

const ELIXIRS = [
  { name: 'Малое зелье', bonus: 5, price: 100 },
  { name: 'Среднее зелье', bonus: 20, price: 500 },
  { name: 'Большое зелье', bonus: 200, price: 5000 },
  { name: 'Великое зелье', bonus: 5000, price: 100000 },
  { name: 'Божественное зелье', bonus: 20000, price: 500000 },
];

export default function CitySection(props: CitySectionProps) {
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);

  // Bank State
  const [pinInput, setPinInput] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // Shop State
  const [shopCategory, setShopCategory] = useState<'weapon' | 'armor'>('weapon');
  const [shopType, setShopType] = useState('sword');
  const [shopLevel, setShopLevel] = useState(1);

  // Church State
  const [partnerName, setPartnerName] = useState('');

  const handleBuyElixir = (elixir: any, stat: string) => {
    if ((props.resources.gold || 0) >= elixir.price) {
      props.setResources({ ...props.resources, gold: (props.resources.gold || 0) - elixir.price });
      props.setBuffStats({ ...props.buffStats, [stat]: props.buffStats[stat] + elixir.bonus });
      alert(`Вы купили ${elixir.name} и увеличили ${stat} на ${elixir.bonus}!`);
    } else {
      alert('Недостаточно золота!');
    }
  };

  const handleBuyItem = (item: any) => {
    if ((props.resources.gold || 0) >= item.price) {
      props.setResources({ ...props.resources, gold: (props.resources.gold || 0) - item.price });
      props.setInventory([...props.inventory, item]);
      alert(`Вы купили ${item.name}!`);
    } else {
      alert('Недостаточно золота!');
    }
  };

  const renderBuildingContent = () => {
    switch (activeBuilding) {
      case 'bank':
        if (!props.bankAccount.isOpen) {
          return (
            <div className="flex flex-col gap-4 items-center justify-center h-full">
              <Landmark className="w-16 h-16 text-yellow-400 mb-4" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Открыть счет</h2>
              <input 
                type="password" maxLength={4} placeholder="Придумайте PIN (4 цифры)"
                value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-white w-64"
              />
              <button 
                onClick={() => {
                  if (pinInput.length === 4) {
                    props.setBankAccount({ ...props.bankAccount, isOpen: true, pin: pinInput });
                    setPinInput('');
                  } else alert('PIN должен состоять из 4 цифр');
                }}
                className="w-64 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-500/30 transition-all"
              >
                Открыть
              </button>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Баланс счета</span>
                <span className="text-2xl font-black text-yellow-400 flex items-center gap-2"><Coins className="w-5 h-5"/> {props.bankAccount.balance}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Кредит</span>
                <span className="text-xl font-black text-red-400 flex items-center gap-2"><Coins className="w-4 h-4"/> {props.bankAccount.loan}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Депозит / Снятие</h3>
                <input type="number" placeholder="Сумма" id="depAmount" className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => {
                    const amt = parseInt((document.getElementById('depAmount') as HTMLInputElement).value);
                    if (amt > 0 && (props.resources.gold || 0) >= amt) {
                      props.setResources({ ...props.resources, gold: (props.resources.gold || 0) - amt });
                      props.setBankAccount({ ...props.bankAccount, balance: props.bankAccount.balance + amt });
                    }
                  }} className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase">Положить</button>
                  <button onClick={() => {
                    const amt = parseInt((document.getElementById('depAmount') as HTMLInputElement).value);
                    if (amt > 0 && props.bankAccount.balance >= amt) {
                      props.setResources({ ...props.resources, gold: (props.resources.gold || 0) + amt });
                      props.setBankAccount({ ...props.bankAccount, balance: props.bankAccount.balance - amt });
                    }
                  }} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase">Снять</button>
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Перевод игроку</h3>
                <input type="text" placeholder="Ник или ID" value={transferTarget} onChange={e => setTransferTarget(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                <input type="number" placeholder="Сумма" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                <button onClick={() => {
                  const amt = parseInt(transferAmount);
                  if (amt > 0 && props.bankAccount.balance >= amt && transferTarget) {
                    props.setBankAccount({ ...props.bankAccount, balance: props.bankAccount.balance - amt });
                    alert(`Успешный перевод ${amt} золота игроку ${transferTarget}`);
                    setTransferTarget(''); setTransferAmount('');
                  }
                }} className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold uppercase">Перевести</button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Кредит (10% ставка)</h3>
              <button onClick={() => {
                const amt = parseInt(prompt("Сумма кредита:") || "0");
                if (amt > 0) {
                  props.setBankAccount({ ...props.bankAccount, loan: props.bankAccount.loan + Math.floor(amt * 1.1) });
                  props.setResources({ ...props.resources, gold: (props.resources.gold || 0) + amt });
                }
              }} className="w-full py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-bold uppercase">Взять кредит</button>
            </div>
          </div>
        );

      case 'pharmacy':
        return (
          <div className="flex flex-col gap-4">
            <div className="text-center mb-4">
              <FlaskConical className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Аптека</h2>
              <p className="text-xs text-white/40">Эликсиры навсегда повышают ваши характеристики</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {ELIXIRS.map((elixir, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{elixir.name}</span>
                    <span className="text-[10px] text-green-400 uppercase tracking-widest">+{elixir.bonus} к стату</span>
                  </div>
                  <div className="flex gap-2">
                    {['str', 'agi', 'int', 'end'].map(stat => (
                      <button key={stat} onClick={() => handleBuyElixir(elixir, stat)} className="px-2 py-1 bg-white/10 rounded text-[8px] font-bold uppercase hover:bg-white/20 transition-all">
                        {stat}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-yellow-400 flex items-center gap-1"><Coins className="w-3 h-3"/> {elixir.price}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'weapon':
      case 'armor':
        const types = activeBuilding === 'weapon' ? WEAPON_TYPES : ARMOR_TYPES;
        const items = generateItems(shopType, shopLevel);
        return (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {types.map(t => (
                <button key={t} onClick={() => setShopType(t)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all ${shopType === t ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {ITEM_LEVELS.map(l => (
                <button key={l} onClick={() => setShopLevel(l)} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap transition-all ${shopLevel === l ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}>
                  {l} ур
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{item.name}</span>
                    <span className="text-[10px] text-white/40 uppercase">Ур. {item.level} | Статы: ~{item.stats.str}</span>
                  </div>
                  <button onClick={() => handleBuyItem(item)} className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl text-xs font-bold uppercase flex items-center gap-1 hover:bg-yellow-500/30">
                    <Coins className="w-3 h-3"/> {item.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'station':
        return (
          <div className="flex flex-col gap-4">
            <div className="text-center mb-4">
              <Train className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Вокзал</h2>
              <p className="text-xs text-white/40">Билет в любой город стоит 1000 золота</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CITIES.map(city => {
                const Icon = city.icon;
                return (
                  <button key={city.name} onClick={() => {
                    if (props.resources.gold >= 1000) {
                      props.setResources({ ...props.resources, gold: (props.resources.gold || 0) - 1000 });
                      props.setCurrentCity(city.name);
                      alert(`Вы прибыли в ${city.name}!`);
                    } else alert('Недостаточно золота!');
                  }} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${props.currentCity === city.name ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                    <Icon className="w-8 h-8" />
                    <span className="text-xs font-black uppercase tracking-widest">{city.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'church':
        return (
          <div className="flex flex-col gap-6 items-center justify-center h-full">
            <Church className="w-16 h-16 text-yellow-400 mb-4" />
            <button onClick={() => {
              props.setBlessing({ active: true, expiresAt: Date.now() + 3600000 });
              props.onGlobalMessage(`Игрок получил благословение на час +30 к статам`);
              alert('Вы получили благословение!');
            }} className="w-full py-4 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-500/30 transition-all">
              Помолиться (+30 статов на 1ч)
            </button>
            <div className="w-full h-px bg-white/10 my-4" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Венчание (5000 золота)</h3>
            <input type="text" placeholder="Ник партнера" value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-center text-sm text-white" />
            <button onClick={() => {
              if ((props.resources.gold || 0) >= 5000 && partnerName) {
                props.setResources({ ...props.resources, gold: (props.resources.gold || 0) - 5000 });
                props.onGlobalMessage(`Поздравьте игрока и ${partnerName} с бракосочетанием! Новые молодожёны!`);
                setPartnerName('');
              }
            }} className="w-full py-4 bg-pink-500/20 text-pink-400 border border-pink-500/50 rounded-xl font-bold uppercase tracking-widest hover:bg-pink-500/30 transition-all">
              Сыграть свадьбу
            </button>
          </div>
        );

      case 'workshop':
        return (
          <div className="flex flex-col gap-4 items-center justify-center h-full text-center">
            <Hammer className="w-16 h-16 text-orange-400 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Мастерская</h2>
            <p className="text-xs text-white/40 mb-4">Ремонт, заточка, вставка камней и разборка вещей</p>
            <button onClick={() => alert('Функция починки в разработке')} className="w-full py-3 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/20">Починить все (1000 з.)</button>
            <button onClick={() => alert('Функция улучшения в разработке')} className="w-full py-3 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/20">Улучшить экипировку</button>
            <button onClick={() => {
              if (props.inventory.length > 0) {
                const newEquipped = { ...props.equippedItems };
                let upgraded = false;
                
                // Simple auto-upgrade logic: add +1 to stats of equipped items
                Object.keys(newEquipped).forEach(slot => {
                  if (newEquipped[slot]) {
                    newEquipped[slot] = {
                      ...newEquipped[slot],
                      stats: {
                        ...newEquipped[slot].stats,
                        str: (newEquipped[slot].stats.str || 0) + 1,
                        agi: (newEquipped[slot].stats.agi || 0) + 1,
                        int: (newEquipped[slot].stats.int || 0) + 1,
                        end: (newEquipped[slot].stats.end || 0) + 1,
                      }
                    };
                    upgraded = true;
                  }
                });
                
                if (upgraded) {
                  props.setEquippedItems(newEquipped);
                  props.setInventory([]); // Clear inventory
                  alert('Вы разобрали все вещи в рюкзаке и улучшили надетую экипировку!');
                } else {
                  alert('У вас нет надетой экипировки для улучшения!');
                }
              } else {
                alert('В рюкзаке нет вещей для разборки!');
              }
            }} className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl font-bold uppercase tracking-widest hover:bg-red-500/30">Разобрать хлам</button>
          </div>
        );

      case 'hospital':
        return (
          <div className="flex flex-col gap-4 items-center justify-center h-full text-center">
            <HeartPulse className="w-16 h-16 text-red-400 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Больница</h2>
            <p className="text-xs text-white/40 mb-4">Текущие травмы: {props.injuries}</p>
            <button onClick={() => {
              if (props.injuries > 0) {
                if ((props.resources.gold || 0) >= props.injuries * 100) {
                  props.setResources({ ...props.resources, gold: (props.resources.gold || 0) - props.injuries * 100 });
                  props.setInjuries(0);
                  alert('Травмы вылечены!');
                } else alert('Недостаточно золота!');
              } else alert('У вас нет травм!');
            }} className="w-full py-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl font-bold uppercase tracking-widest hover:bg-red-500/30 transition-all">
              Вылечить травмы ({(props.injuries * 100)} з.)
            </button>
          </div>
        );

      case 'auction':
        return (
          <div className="flex flex-col gap-4 items-center justify-center h-full text-center">
            <Gavel className="w-16 h-16 text-purple-400 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Аукцион</h2>
            <p className="text-xs text-white/40 mb-4">Торговля вещами 30+ уровня между игроками</p>
            <div className="w-full p-8 border border-dashed border-white/20 rounded-2xl text-white/40">
              Нет доступных лотов
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4 px-4 pb-32">
      <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Текущий город</span>
          <span className="text-lg font-black text-white uppercase tracking-wider">{props.currentCity}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          {(() => {
            const Icon = CITIES.find(c => c.name === props.currentCity)?.icon;
            return Icon ? <Icon className="w-5 h-5 text-blue-400" /> : null;
          })()}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeBuilding ? (
          <motion.div 
            key="building"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl flex flex-col min-h-[500px]"
          >
            <button onClick={() => setActiveBuilding(null)} className="flex items-center gap-2 text-white/40 hover:text-white mb-4 transition-colors w-fit">
              <ChevronLeft className="w-5 h-5" /> <span className="text-xs font-bold uppercase tracking-widest">Назад в город</span>
            </button>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {renderBuildingContent()}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-2 gap-3"
          >
            <BuildingButton icon={Landmark} name="Банк" color="text-yellow-400" bg="bg-yellow-500/10" onClick={() => setActiveBuilding('bank')} />
            <BuildingButton icon={FlaskConical} name="Аптека" color="text-green-400" bg="bg-green-500/10" onClick={() => setActiveBuilding('pharmacy')} />
            <BuildingButton icon={Sword} name="Оружие" color="text-red-400" bg="bg-red-500/10" onClick={() => { setActiveBuilding('weapon'); setShopType('sword'); }} />
            <BuildingButton icon={Shield} name="Броня" color="text-blue-400" bg="bg-blue-500/10" onClick={() => { setActiveBuilding('armor'); setShopType('helmet'); }} />
            <BuildingButton icon={Train} name="Вокзал" color="text-cyan-400" bg="bg-cyan-500/10" onClick={() => setActiveBuilding('station')} />
            <BuildingButton icon={Church} name="Церковь" color="text-yellow-200" bg="bg-yellow-200/10" onClick={() => setActiveBuilding('church')} />
            <BuildingButton icon={Hammer} name="Мастерская" color="text-orange-400" bg="bg-orange-500/10" onClick={() => setActiveBuilding('workshop')} />
            <BuildingButton icon={HeartPulse} name="Больница" color="text-pink-400" bg="bg-pink-500/10" onClick={() => setActiveBuilding('hospital')} />
            <BuildingButton icon={Gavel} name="Аукцион" color="text-purple-400" bg="bg-purple-500/10" onClick={() => setActiveBuilding('auction')} className="col-span-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BuildingButton({ icon: Icon, name, color, bg, onClick, className = '' }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-xl group ${className}`}>
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{name}</span>
    </button>
  );
}
