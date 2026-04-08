import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShieldAlert, Crown, LifeBuoy, User, Circle, Hash } from "lucide-react";
import PlayerProfileModal from "./PlayerProfileModal";

type Role = 'player' | 'admin' | 'moderator' | 'support';

interface CommunityPlayer {
  id: string;
  name: string;
  role: Role;
  level: number;
  online: boolean;
}

const MOCK_PLAYERS: CommunityPlayer[] = [
  { id: "10293", name: "LegionMaster", role: "admin", level: 50, online: true },
  { id: "98765", name: "ShadowSlayer", role: "moderator", level: 48, online: true },
  { id: "56473", name: "IronWill", role: "support", level: 45, online: true },
  { id: "19283", name: "StormBringer", role: "player", level: 42, online: true },
  { id: "12345", name: "Phoenix", role: "player", level: 40, online: false },
  { id: "55566", name: "DragonSlayer", role: "player", level: 35, online: true },
  { id: "99988", name: "NightKing", role: "moderator", level: 49, online: false },
  { id: "11122", name: "HealerPro", role: "support", level: 30, online: true },
];

type CommunityTab = 'online' | 'staff' | 'search' | 'global_chat' | 'clan_chat';

export default function CommunitySection() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('global_chat');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [globalMessages, setGlobalMessages] = useState<{id: string, author: string, text: string, time: string}[]>([
    { id: '1', author: 'System', text: 'Добро пожаловать в глобальный чат!', time: '12:00' }
  ]);
  const [clanMessages, setClanMessages] = useState<{id: string, author: string, text: string, time: string}[]>([
    { id: '1', author: 'System', text: 'Добро пожаловать в чат клана!', time: '12:00' }
  ]);

  const handleSendMessage = (type: 'global' | 'clan') => {
    if (!chatMessage.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      author: 'Вы',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (type === 'global') {
      setGlobalMessages(prev => [...prev, newMessage]);
    } else {
      setClanMessages(prev => [...prev, newMessage]);
    }
    setChatMessage("");
  };

  const onlinePlayers = MOCK_PLAYERS.filter(p => p.online && p.role === 'player');
  const staffPlayers = MOCK_PLAYERS.filter(p => p.role !== 'player');
  
  const searchResults = MOCK_PLAYERS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.includes(searchQuery)
  );

  const getRoleIcon = (role: Role) => {
    switch(role) {
      case 'admin': return <Crown className="w-4 h-4 text-red-500" />;
      case 'moderator': return <ShieldAlert className="w-4 h-4 text-green-500" />;
      case 'support': return <LifeBuoy className="w-4 h-4 text-purple-500" />;
      default: return <User className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRoleLabel = (role: Role) => {
    switch(role) {
      case 'admin': return <span className="text-[8px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Админ</span>;
      case 'moderator': return <span className="text-[8px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Модератор</span>;
      case 'support': return <span className="text-[8px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">Поддержка</span>;
      default: return null;
    }
  };

  const PlayerCard = ({ player }: { player: CommunityPlayer, key?: string }) => (
    <div 
      onClick={() => setSelectedPlayerId(player.id)}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            {getRoleIcon(player.role)}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${player.online ? 'bg-emerald-500' : 'bg-gray-500'}`} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{player.name}</span>
            {getRoleLabel(player.role)}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {player.id}</span>
            <span>•</span>
            <span>{player.level} lvl</span>
          </div>
        </div>
      </div>
      <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white transition-all">
        Профиль
      </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md flex flex-col gap-6 px-4 pb-32"
    >
      <div className="flex flex-col items-center gap-2 text-center mb-2">
        <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Сообщество</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-widest">Игроки и администрация</p>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-xl gap-1">
        <button 
          onClick={() => setActiveTab('global_chat')}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'global_chat' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Глобал
        </button>
        <button 
          onClick={() => setActiveTab('clan_chat')}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clan_chat' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Клан
        </button>
        <button 
          onClick={() => setActiveTab('online')}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'online' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Онлайн
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Админы
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex-1 min-w-[80px] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'search' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/50'}`}
        >
          Поиск
        </button>
      </div>

      <AnimatePresence mode="wait">
        {(activeTab === 'global_chat' || activeTab === 'clan_chat') && (
          <motion.div key="chat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-4 h-[400px]">
            <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 overflow-y-auto flex flex-col gap-3">
              {(activeTab === 'global_chat' ? globalMessages : clanMessages).map(msg => (
                <div key={msg.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${msg.author === 'System' ? 'text-red-400' : msg.author === 'Вы' ? 'text-emerald-400' : 'text-white/60'}`}>{msg.author}</span>
                    <span className="text-[8px] text-white/20">{msg.time}</span>
                  </div>
                  <p className="text-sm text-white/80">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(activeTab === 'global_chat' ? 'global' : 'clan')}
                placeholder="Сообщение..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
              />
              <button 
                onClick={() => handleSendMessage(activeTab === 'global_chat' ? 'global' : 'clan')}
                className="px-6 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all text-[10px]"
              >
                Отправить
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'online' && (
          <motion.div key="online" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-3">
            {onlinePlayers.map(p => <PlayerCard key={p.id} player={p} />)}
            {onlinePlayers.length === 0 && <div className="text-center py-8 text-white/30 text-xs font-black uppercase tracking-widest">Нет игроков онлайн</div>}
          </motion.div>
        )}

        {activeTab === 'staff' && (
          <motion.div key="staff" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-3">
            {staffPlayers.map(p => <PlayerCard key={p.id} player={p} />)}
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div key="search" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Поиск по нику или ID (10 цифр)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-3">
              {searchQuery.length > 0 ? (
                searchResults.length > 0 ? (
                  searchResults.map(p => <PlayerCard key={p.id} player={p} />)
                ) : (
                  <div className="text-center py-8 text-white/30 text-xs font-black uppercase tracking-widest">Игрок не найден</div>
                )
              ) : (
                <div className="text-center py-8 text-white/30 text-xs font-black uppercase tracking-widest">Введите ник или ID для поиска</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPlayerId && (
        <PlayerProfileModal 
          playerId={selectedPlayerId} 
          onClose={() => setSelectedPlayerId(null)} 
        />
      )}
    </motion.div>
  );
}
