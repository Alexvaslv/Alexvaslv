import { useState } from "react";
import { motion } from "motion/react";
import { User, Lock, Gift, AlertCircle } from "lucide-react";

interface SaveHeroModalProps {
  onSave: (username: string, email: string, password: string, gender: 'male' | 'female', side: 'light' | 'dark', race: 'human' | 'elf' | 'mage' | 'druid') => void;
}

const TAKEN_NAMES = ['admin', 'moderator', 'support', 'goro'];

export default function SaveHeroModal({ onSave }: SaveHeroModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [side, setSide] = useState<'light' | 'dark'>('light');
  const [race, setRace] = useState<'human' | 'elf' | 'mage' | 'druid'>('human');
  const [error, setError] = useState<string | null>(null);

  const validateUsername = (name: string) => {
    if (name.length < 4 || name.length > 12) return "Ник должен быть от 4 до 12 символов";
    if (!/^[a-zA-Z]+$/.test(name)) return "Только английские буквы, без пробелов и цифр";
    if (TAKEN_NAMES.includes(name.toLowerCase())) return "Этот ник уже занят";
    return null;
  };

  const handleSave = () => {
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (email.trim() && password.trim()) {
      setError(null);
      onSave(username, email.trim(), password.trim(), gender, side, race);
    } else {
      setError("Заполните все поля");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-6 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)] mb-2">
            <Gift className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">Победа!</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Сохраните героя, чтобы получить награду</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Email</span>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Имя героя</span>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="Только англ. буквы (4-12)" 
                className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all`}
              />
            </div>
            {error && (
              <div className="flex items-center gap-1 mt-1 ml-2">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-bold text-red-500">{error}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Пароль</span>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Пол</span>
              <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                <button onClick={() => setGender('male')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${gender === 'male' ? 'bg-white/10 text-white' : 'text-white/30'}`}>М</button>
                <button onClick={() => setGender('female')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${gender === 'female' ? 'bg-white/10 text-white' : 'text-white/30'}`}>Ж</button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Сторона</span>
              <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                <button onClick={() => setSide('light')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${side === 'light' ? 'bg-white/10 text-white' : 'text-white/30'}`}>Свет</button>
                <button onClick={() => setSide('dark')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${side === 'dark' ? 'bg-white/10 text-white' : 'text-white/30'}`}>Тьма</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Раса</span>
            <div className="grid grid-cols-4 gap-1 bg-white/5 rounded-2xl p-1 border border-white/10">
              {['human', 'elf', 'mage', 'druid'].map(r => (
                <button key={r} onClick={() => setRace(r as any)} className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${race === r ? 'bg-white/10 text-white' : 'text-white/30'}`}>
                  {r === 'human' ? 'Чел' : r === 'elf' ? 'Эльф' : r === 'mage' ? 'Маг' : 'Друид'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={!username || !password.trim()}
          className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          Сохранить и войти
        </button>
      </motion.div>
    </div>
  );
}
