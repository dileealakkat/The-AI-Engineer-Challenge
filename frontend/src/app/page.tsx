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
      const res = await fetch('/api/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          developer_message: "You are a helpful assistant.",
          user_message: input,
          model: "gpt-4.1-mini"
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-2">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
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
          className="flex p-4 border-t border-zinc-200 mt-4"
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
