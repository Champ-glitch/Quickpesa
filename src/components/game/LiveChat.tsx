import { useState, useRef, useEffect } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';
import { generateChatHistory } from '@/mocks/gameRounds';
import { Send, Gift, MessageCircle } from 'lucide-react';
import type { ChatMessage } from '@/types';

export const LiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(generateChatHistory());
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendChat } = useGameSocket();

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChat(input.trim());
    setMessages(prev => [...prev, { id: `c${Date.now()}`, userId: 'u', username: 'You', message: input.trim(), type: 'chat', createdAt: Date.now() }]);
    setInput('');
  };

  const style = (t: ChatMessage['type']) => {
    switch(t) {
      case 'system': return 'text-brand-orange text-[10px] text-center py-0.5';
      case 'win': return 'bg-green-500/10 border border-green-500/20 rounded-lg p-1.5';
      case 'rain': return 'bg-brand-orange/10 border border-brand-orange/20 rounded-lg p-1.5';
      default: return 'py-0.5';
    }
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-20 right-3 z-40 w-11 h-11 bg-brand-green rounded-full flex items-center justify-center shadow-lg">
        <MessageCircle className="w-5 h-5 text-white" />
      </button>
      {open && (
        <div className="fixed bottom-32 right-3 z-40 w-72 max-w-[calc(100vw-1.5rem)] bg-dark-800 border border-dark-border rounded-2xl shadow-2xl flex flex-col max-h-[55vh]">
          <div className="p-2.5 border-b border-dark-border flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-brand-green" /> Live Chat</h3>
            <span className="text-[10px] text-gray-500">128 online</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {messages.map(m => (
              <div key={m.id} className={style(m.type)}>
                {m.type === 'chat' && <div className="flex items-start gap-1.5"><span className="text-[10px] font-bold text-brand-green">{m.username}:</span><span className="text-[10px] text-gray-300">{m.message}</span></div>}
                {m.type === 'win' && <div className="flex items-center gap-1"><span className="text-[10px] font-bold text-green-400">{m.username}</span><span className="text-[10px] text-gray-500">won</span><span className="text-[10px] font-bold text-brand-green">{m.amount && `KSh ${m.amount.toLocaleString()}`}</span><span className="text-[10px] text-gray-500">@</span><span className="text-[10px] font-bold text-brand-orange">{m.multiplier}x</span></div>}
                {m.type === 'rain' && <div className="flex items-center gap-1 justify-center"><Gift className="w-3 h-3 text-brand-orange" /><span className="text-[10px] text-brand-orange font-medium">{m.message}</span></div>}
                {m.type === 'system' && <span className="text-[10px]">{m.message}</span>}
              </div>
            ))}
          </div>
          <div className="p-2.5 border-t border-dark-border">
            <div className="flex gap-1.5">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type..." className="flex-1 bg-dark-900 border border-dark-border rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green" />
              <button onClick={handleSend} className="p-1.5 bg-brand-green rounded-lg text-white hover:bg-brand-greenDark"><Send className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
