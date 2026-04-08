import { motion, AnimatePresence } from "motion/react";
import { Mail, X, Gift, CheckCircle } from "lucide-react";

export interface MailMessage {
  id: string;
  title: string;
  content: string;
  read: boolean;
  hasGift?: boolean;
  giftClaimed?: boolean;
}

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MailMessage[];
  onRead: (id: string) => void;
  onClaimGift: (id: string) => void;
}

export default function MailModal({ isOpen, onClose, messages, onRead, onClaimGift }: MailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-6 shadow-2xl max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white/60" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Почта</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-xs font-black uppercase tracking-widest">
              Нет новых писем
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id}
                onClick={() => !msg.read && onRead(msg.id)}
                className={`bg-white/5 border rounded-2xl p-4 flex flex-col gap-3 transition-all ${msg.read ? 'border-white/5 opacity-70' : 'border-white/20 cursor-pointer hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">{msg.title}</h3>
                  {!msg.read && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{msg.content}</p>
                
                {msg.hasGift && (
                  <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-yellow-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500/70">Подарок</span>
                    </div>
                    {msg.giftClaimed ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Получено</span>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onClaimGift(msg.id); }}
                        className="px-4 py-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500/30 transition-all"
                      >
                        Забрать
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
