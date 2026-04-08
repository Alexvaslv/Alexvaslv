import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Globe, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  type: 'global' | 'clan' | 'system';
  timestamp: number;
}

interface ChatOverlayProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, type: 'global' | 'clan') => void;
  username: string;
}

export default function ChatOverlay({ messages, onSendMessage, username }: ChatOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'clan'>('global');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue, activeTab);
    setInputValue('');
  };

  const filteredMessages = messages.filter(m => m.type === activeTab || m.type === 'system');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-all z-40"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 bg-white/5 border-b border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('global')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${activeTab === 'global' ? 'bg-blue-500/20 text-blue-400' : 'text-white/40 hover:text-white/60'}`}
                >
                  <Globe className="w-3 h-3" /> Мир
                </button>
                <button
                  onClick={() => setActiveTab('clan')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${activeTab === 'clan' ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white/60'}`}
                >
                  <Users className="w-3 h-3" /> Клан
                </button>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {filteredMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.type === 'system' ? 'items-center' : 'items-start'}`}>
                  {msg.type === 'system' ? (
                    <span className="text-[10px] text-yellow-400/80 bg-yellow-400/10 px-2 py-1 rounded-full text-center">
                      {msg.text}
                    </span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-white/40">{msg.sender}</span>
                      <div className={`px-3 py-1.5 rounded-xl text-sm ${msg.sender === username ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-white/80 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Сообщение..."
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
