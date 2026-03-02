// ============================================
// AI Chat Bubble - Floating chat assistant
// ============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { formatCurrency, formatDate, getStatusBadge, translateStatus } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  items?: ChatItem[];
  action?: ChatAction | null;
}

interface ChatItem {
  id: string;
  type: 'order' | 'invoice' | 'calculation' | 'product';
  name: string;
  number: string;
  status: string;
  value: number;
  date: string;
  url?: string;
}

interface ChatAction {
  type: 'search_results' | 'navigate' | 'duplicate_order';
  data: any;
}

export default function AiChatBubble() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [dupNotes, setDupNotes] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      // Build history (just text, no items)
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/proxy/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'Prepáčte, nastala chyba.',
        items: data.items || [],
        action: data.action || null,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Auto-navigate if action says so
      if (data.action?.type === 'navigate' && data.action.data?.url) {
        setTimeout(() => {
          window.location.href = data.action.data.url;
        }, 1500);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Chyba pripojenia. Skúste znova.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDuplicate(orderId: string) {
    setDuplicating(null);
    setLoading(true);

    try {
      const res = await fetch('/api/proxy/ai/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, modifications: { notes: dupNotes } }),
      });
      const data = await res.json();
      const resultMsg: ChatMessage = {
        role: 'assistant',
        content: data.success
          ? `✅ ${data.message}`
          : `❌ ${data.error || 'Nepodarilo sa duplikovať zákazku.'}`,
      };
      setMessages((prev) => [...prev, resultMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Chyba pripojenia pri duplikovaní.' },
      ]);
    } finally {
      setLoading(false);
      setDupNotes('');
    }
  }

  const quickActions = [
    'Moje aktívne zákazky',
    'Nezaplatené faktúry',
    'Koľko som minul tento rok?',
    'Chcem objednať vizitky',
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-adsun-orange text-adsun-black shadow-lg shadow-orange-500/30 hover:scale-110 transition-transform flex items-center justify-center md:bottom-8 md:right-8"
        aria-label="AI Asistent"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 md:right-8 md:bottom-28"
          style={{ background: 'rgba(15,15,15,0.98)', backdropFilter: 'blur(20px)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-adsun-orange/5">
            <div className="w-8 h-8 rounded-full bg-adsun-orange flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-adsun-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-semibold">AI Asistent</h3>
              <p className="text-adsun-muted text-[11px]">Hľadajte, objednávajte, pýtajte sa</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-adsun-muted hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-adsun-orange/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-adsun-orange" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <p className="text-white text-sm font-medium mb-1">Ahoj! Som váš AI asistent.</p>
                <p className="text-adsun-muted text-xs mb-4">Opýtajte sa na čokoľvek o vašich zákazkách, faktúrach alebo objednávkach.</p>

                <div className="space-y-2">
                  {quickActions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setMessage(q);
                        setTimeout(() => {
                          const form = document.getElementById('ai-chat-form') as HTMLFormElement;
                          form?.requestSubmit();
                        }, 50);
                      }}
                      className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-white/10 text-adsun-muted hover:border-adsun-orange hover:text-adsun-orange transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                {/* Message bubble */}
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-adsun-orange text-adsun-black rounded-br-md'
                        : 'bg-white/5 text-white/90 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Items (search results / products) */}
                {msg.items && msg.items.length > 0 && (
                  <div className="mt-2 space-y-1.5 ml-1">
                    {msg.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 bg-white/5 rounded-lg px-3 py-2 text-xs border border-white/5 hover:border-adsun-orange/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          {item.type === 'product' ? (
                            <>
                              <p className="text-white/90 font-medium">{item.name}</p>
                              <p className="text-adsun-muted mt-0.5">{item.number}</p>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-adsun-orange font-mono">{item.number}</span>
                                <span className={`badge text-[10px] ${getStatusBadge(item.status)}`}>
                                  {translateStatus(item.status)}
                                </span>
                              </div>
                              <p className="text-white/80 truncate">{item.name}</p>
                              <div className="flex gap-3 text-adsun-muted mt-0.5">
                                <span>{formatDate(item.date)}</span>
                                {item.value > 0 && (
                                  <span className="text-adsun-orange">{formatCurrency(item.value)}</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {item.type === 'product' && (
                            <a
                              href={item.url || `/products/${item.id}`}
                              className="text-[10px] px-2.5 py-1.5 rounded bg-adsun-orange text-adsun-black font-medium hover:bg-adsun-orange-light transition-colors"
                            >
                              Objednať →
                            </a>
                          )}
                          {item.type === 'order' && (
                            <a
                              href={`/orders/${item.id}`}
                              className="text-[10px] px-2 py-1 rounded bg-white/10 text-white hover:bg-adsun-orange hover:text-adsun-black transition-colors"
                            >
                              Detail
                            </a>
                          )}
                          {(item.type === 'order' || item.type === 'calculation') && (
                            <button
                              onClick={() => setDuplicating(item.id)}
                              className="text-[10px] px-2 py-1 rounded bg-adsun-orange/20 text-adsun-orange hover:bg-adsun-orange hover:text-adsun-black transition-colors"
                            >
                              Zopakovať
                            </button>
                          )}
                          {item.type === 'invoice' && (
                            <a
                              href="/invoices"
                              className="text-[10px] px-2 py-1 rounded bg-white/10 text-white hover:bg-adsun-orange hover:text-adsun-black transition-colors"
                            >
                              Faktúry
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Duplicate panel inline */}
                {msg.action?.type === 'duplicate_order' && (
                  <div className="mt-2 ml-1 bg-white/5 rounded-lg p-3 border border-adsun-orange/20">
                    <p className="text-white text-xs font-medium mb-2">Zopakovať zákazku?</p>
                    <input
                      type="text"
                      value={dupNotes}
                      onChange={(e) => setDupNotes(e.target.value)}
                      placeholder="Zmeny (napr. 500ks miesto 200ks)..."
                      className="text-xs mb-2 w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white placeholder:text-white/30 focus:border-adsun-orange outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDuplicate(msg.action!.data.orderId)}
                        className="text-[10px] px-3 py-1.5 rounded bg-adsun-orange text-adsun-black font-medium hover:bg-adsun-orange-light transition-colors"
                      >
                        Vytvoriť kópiu
                      </button>
                      <button
                        onClick={() => { setDuplicating(null); setDupNotes(''); }}
                        className="text-[10px] px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                      >
                        Zrušiť
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Inline duplicate (from item button) */}
            {duplicating && !messages.some((m) => m.action?.type === 'duplicate_order') && (
              <div className="bg-white/5 rounded-lg p-3 border border-adsun-orange/20">
                <p className="text-white text-xs font-medium mb-2">Zmeny oproti originálu:</p>
                <input
                  type="text"
                  value={dupNotes}
                  onChange={(e) => setDupNotes(e.target.value)}
                  placeholder="napr. 500ks miesto 200ks, iná farba..."
                  className="text-xs mb-2 w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white placeholder:text-white/30 focus:border-adsun-orange outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDuplicate(duplicating)}
                    className="text-[10px] px-3 py-1.5 rounded bg-adsun-orange text-adsun-black font-medium hover:bg-adsun-orange-light transition-colors"
                  >
                    Vytvoriť kópiu
                  </button>
                  <button
                    onClick={() => { setDuplicating(null); setDupNotes(''); }}
                    className="text-[10px] px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Zrušiť
                  </button>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-adsun-orange/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-adsun-orange/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-adsun-orange/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form id="ai-chat-form" onSubmit={handleSend} className="px-3 py-2.5 border-t border-white/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Napíšte správu..."
                disabled={loading}
                className="flex-1 text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 focus:border-adsun-orange outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-adsun-orange text-adsun-black flex items-center justify-center hover:bg-adsun-orange-light transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
