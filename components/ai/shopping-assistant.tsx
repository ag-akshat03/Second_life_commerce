"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

export function AiShoppingAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Amazon shopping assistant. Ask about products, orders, Prime, or deals."
    }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(["Today's deals", "Track my order", "Best phones"]);
  const endRef = useRef<HTMLDivElement>(null);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = (await res.json()) as { reply: string; suggestions?: string[] };
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      if (data.suggestions) setSuggestions(data.suggestions);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }
      ]);
    } finally {
      setLoading(false);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amazon-orange text-slate-950 shadow-cardHover transition hover:scale-105",
          open && "pointer-events-none opacity-0"
        )}
        aria-label="Open shopping assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[min(520px,80vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-dropdown dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between bg-amazon-navy px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-amazon-gold" />
                <span className="font-bold">Shopping Assistant</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[90%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                    msg.role === "user"
                      ? "ml-auto bg-amazon-orange/20 text-slate-900 dark:text-white"
                      : "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-200"
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {loading && <p className="text-xs text-slate-500">Thinking…</p>}
              <div ref={endRef} />
            </div>

            <div className="flex flex-wrap gap-1 border-t border-slate-100 px-3 py-2 dark:border-white/10">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-xs hover:border-amazon-orange dark:border-white/20"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              className="flex gap-2 border-t border-slate-200 p-3 dark:border-white/10"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amazon-orange dark:border-white/20 dark:bg-slate-950"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-10 w-10 items-center justify-center rounded-md bg-amazon-orange text-slate-950 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
