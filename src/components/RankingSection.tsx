import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Trophy, Search, Hash, User } from "lucide-react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../firebase";
import PlayerProfileModal from "./PlayerProfileModal";
import { formatNumber } from "../constants";

interface Hero {
  id: string;
  name: string;
  level: number;
  power: number;
  playerId: string;
}

export default function RankingSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const q = query(
          collection(db, "users"), 
          where("isAccountHidden", "==", false),
          orderBy("level", "desc"), 
          limit(100)
        );
        const snapshot = await getDocs(q);
        const fetchedHeroes = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            playerId: data.playerId || doc.id,
            name: data.username || "Unknown",
            level: data.level || 1,
            power: (data.level || 1) * 1000 + (data.xp || 0), // Simple power calculation
          };
        });
        setHeroes(fetchedHeroes.sort((a, b) => b.power - a.power));
      } catch (error) {
        console.error("Error fetching heroes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  const filteredHeroes = useMemo(() => {
    return heroes.filter(h => 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.playerId.includes(searchQuery)
    );
  }, [searchQuery, heroes]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md flex flex-col gap-6 px-4 pb-32"
    >
      <div className="flex flex-col items-center gap-2 text-center mb-2">
        <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Рейтинг</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-widest">Топ героев</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input 
          type="text" 
          placeholder="Поиск героя..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="text-center py-8 text-white/30 text-xs font-black uppercase tracking-widest">Загрузка...</div>
        ) : filteredHeroes.length > 0 ? (
          filteredHeroes.map((hero, index) => (
            <div key={hero.id} onClick={() => setSelectedHero(hero)} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${index < 3 ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-white/50'}`}>
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{hero.name}</span>
                  <span className="text-[10px] text-white/30">{hero.level} lvl</span>
                </div>
              </div>
              <span className="text-sm font-black text-white/80">{formatNumber(hero.power)}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-white/30 text-xs font-black uppercase tracking-widest">Герой не найден</div>
        )}
      </div>

      {selectedHero && (
        <PlayerProfileModal playerId={selectedHero.playerId} onClose={() => setSelectedHero(null)} />
      )}
    </motion.div>
  );
}
