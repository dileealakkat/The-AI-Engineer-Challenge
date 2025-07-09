"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, `You: ${input}`]);
    setInput("");
    // Example: send to backend and get response
    // const res = await fetch('/api/chat', { ... });
    // const data = await res.json();
    // setMessages((msgs) => [...msgs, `Bot: ${data.reply}`]);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-900 text-white">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {messages.map((msg, idx) => (
          <div key={idx} className="my-1 text-base">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex p-4 bg-zinc-800"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-4"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
