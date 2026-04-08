import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, User, Sword, Shield, Zap, Heart, Loader2 } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface PlayerProfileModalProps {
  playerId: string;
  onClose: () => void;
}

export default function PlayerProfileModal({ playerId, onClose }: PlayerProfileModalProps) {
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const q = query(collection(db, "users"), where("playerId", "==", playerId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setPlayerData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching player:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [playerId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm flex flex-col gap-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Профиль</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
          </div>
        ) : playerData ? (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-12 h-12 text-white/50" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">{playerData.username}</h3>
                <p className="text-xs text-white/50">ID: {playerData.playerId}</p>
                {playerData.clanName && <p className="text-xs font-bold text-blue-400 mt-1">Клан: {playerData.clanName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] text-white/40 uppercase">Уровень</span>
                <span className="text-sm font-bold text-white">{playerData.level}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl flex flex-col items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-[10px] text-white/40 uppercase">Здоровье</span>
                <span className="text-sm font-bold text-white">{playerData.hp}</span>
              </div>
            </div>
            
            {playerData.playerStats && (
              <div className="bg-white/5 p-4 rounded-xl flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 text-center mb-2">Статистика</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex justify-between"><span className="text-white/40">Дуэли:</span><span className="text-white">{playerData.playerStats.duel?.wins || 0}/{playerData.playerStats.duel?.losses || 0}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">2x2:</span><span className="text-white">{playerData.playerStats.battle2v2?.wins || 0}/{playerData.playerStats.battle2v2?.losses || 0}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Отряды:</span><span className="text-white">{playerData.playerStats.squadBattle?.wins || 0}/{playerData.playerStats.squadBattle?.losses || 0}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Королевская:</span><span className="text-white">{playerData.playerStats.battleRoyale?.wins || 0}/{playerData.playerStats.battleRoyale?.losses || 0}</span></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white/50 py-10">Игрок не найден</div>
        )}

        <button 
          onClick={onClose}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
        >
          Закрыть
        </button>
      </motion.div>
    </div>
  );
}
