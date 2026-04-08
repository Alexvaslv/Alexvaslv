import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sword, Shield, Heart, Skull, Gift, Mail } from "lucide-react";

interface TutorialBattleProps {
  onVictory: () => void;
}

export default function TutorialBattle({ onVictory }: TutorialBattleProps) {
  const [monsterHp, setMonsterHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);
  const [monsterAttacking, setMonsterAttacking] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>(["Дикий Волк преграждает путь!"]);

  const handleAttack = () => {
    if (isAttacking || monsterHp <= 0 || playerHp <= 0) return;

    setIsAttacking(true);
    const damage = Math.floor(Math.random() * 15) + 10;
    
    setTimeout(() => {
      setMonsterHp(prev => {
        const newHp = Math.max(0, prev - damage);
        setBattleLog(log => [`Вы нанесли ${damage} урона!`, ...log].slice(0, 5));
        if (newHp <= 0) {
          setTimeout(onVictory, 1500);
        }
        return newHp;
      });
      setIsAttacking(false);

      if (monsterHp - damage > 0) {
        monsterTurn();
      }
    }, 500);
  };

  const monsterTurn = () => {
    setTimeout(() => {
      setMonsterAttacking(true);
      const damage = Math.floor(Math.random() * 8) + 5;
      setTimeout(() => {
        setPlayerHp(prev => Math.max(0, prev - damage));
        setBattleLog(log => [`Волк нанес ${damage} урона!`, ...log].slice(0, 5));
        setMonsterAttacking(false);
      }, 500);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Обучение</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest">Победите первого монстра</p>
        </div>

        {/* Battle Arena */}
        <div className="relative h-64 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex items-center justify-between px-8">
          {/* Player */}
          <motion.div 
            animate={{ x: isAttacking ? 50 : 0 }}
            className="flex flex-col items-center gap-4 z-10"
          >
            <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Sword className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Вы</span>
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: "100%" }}
                  animate={{ width: `${playerHp}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Monster */}
          <motion.div 
            animate={{ x: monsterAttacking ? -50 : 0 }}
            className="flex flex-col items-center gap-4 z-10"
          >
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Skull className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Волк</span>
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-red-500"
                  initial={{ width: "100%" }}
                  animate={{ width: `${monsterHp}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleAttack}
            disabled={isAttacking || monsterAttacking || monsterHp <= 0}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Атаковать
          </button>
        </div>

        {/* Battle Log */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 h-32 overflow-hidden">
          <AnimatePresence>
            {battleLog.map((log, i) => (
              <motion.div 
                key={i + log}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1 - i * 0.2, x: 0 }}
                className="text-[10px] font-bold text-white/60 uppercase tracking-wider"
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
