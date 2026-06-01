import { useState, useRef, useEffect } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';
import { generateChatHistory } from '@/mocks/gameRounds';
import { Send, Gift, MessageCircle } from 'lucide-react';
import type { ChatMessage } from '@/types';

export const LiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(generateChatHistory());
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendChat } = useGameSocket();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendChat(input.trim());

    const newMessage: ChatMessage = {
      id: `chat_${Date.now()}`,
      userId: 'user_demo',
      username: 'You',
      message: input.trim(),
      type: 'chat',
      createdAt: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const getMessageStyle = (type: ChatMessage['type']) => {
    switch (type) {
      case 'system':
        return 'text-qp-accent text-xs text-center py-1';
      case 'win':
        return 'bg-green-500/10 border border-green-500/20 rounded-lg p-2';
      case 'rain':
        return 'bg-qp-accent/10 border border-qp-accent/20 rounded-lg p-2';
      default:
        return 'py-1';
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-qp-primary rounded-full flex items-center justify-center shadow-lg shadow-qp-primary/30"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
            {messages.length}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] bg-qp-card border border-qp-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
          <div className="p-3 border-b border-qp-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-qp-text flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-qp-primary" />
              Live Chat
            </h3>
            <span className="text-xs text-qp-muted">128 online</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={getMessageStyle(msg.type)}>
                {msg.type === 'chat' && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-qp-primary">{msg.username}:</span>
                    <span className="text-xs text-qp-text">{msg.message}</span>
                  </div>
                )}
                {msg.type === 'win' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-400">{msg.username}</span>
                    <span className="text-xs text-qp-muted">won</span>
                    <span className="text-xs font-bold text-qp-primary">{msg.amount && `KSh ${msg.amount.toLocaleString()}`}</span>
                    <span className="text-xs text-qp-muted">@</span>
                    <span className="text-xs font-bold text-qp-accent">{msg.multiplier}x</span>
                  </div>
                )}
                {msg.type === 'rain' && (
                  <div className="flex items-center gap-2 justify-center">
                    <Gift className="w-3 h-3 text-qp-accent" />
                    <span className="text-xs text-qp-accent font-medium">{msg.message}</span>
                  </div>
                )}
                {msg.type === 'system' && (
                  <span className="text-xs">{msg.message}</span>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-qp-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-qp-bg border border-qp-border rounded-lg px-3 py-2 text-sm text-qp-text placeholder:text-qp-muted/50 focus:outline-none focus:border-qp-primary"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-qp-primary rounded-lg text-white hover:bg-emerald-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
