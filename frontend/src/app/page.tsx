"use client";
import React, { useState, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    setTyping(true);
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    console.log("Sending message:", input);
    setInput("");
    try {
      // Call /api/chat endpoint
      const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
      const res = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          developer_message: "You are a helpful assistant.",
          user_message: input,
          model: "gpt-4.1-mini",
          //
        }),
      });
      const data = await res.text();
      console.log("Received response:", data);
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: data },
      ]);
    } catch (e) {
      console.error("Error in sendMessage:", e);
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "Error: " + (e as Error).message },
      ]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 dark:bg-black p-4">
      <div className="w-full max-w-xl bg-white/90 dark:bg-zinc-900 rounded-2xl shadow-xl flex flex-col h-[70vh] md:h-[80vh] border border-zinc-200 dark:border-zinc-800">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] text-sm whitespace-pre-line shadow-sm "
                  ${msg.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
                    : msg.role === "assistant"
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"}
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 animate-pulse text-sm">
                Typing…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900 rounded-b-2xl flex gap-2 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <textarea
            className="flex-1 resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[44px] max-h-32 text-sm"
            style={{ fontFamily: "inherit" }}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-semibold shadow-md transition hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
