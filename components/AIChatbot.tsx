"use client";
import { useState } from "react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    
    setMessages(prev => [...prev, { role: "ai", text: data.text }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {isOpen ? (
        <div className="bg-white w-80 h-96 shadow-2xl rounded-2xl flex flex-col border border-gray-200">
          <div className="p-4 bg-blue-600 text-white rounded-t-2xl flex justify-between">
            <span>AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100 text-black'}`}>
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-400">AI đang suy nghĩ...</div>}
          </div>
          <div className="p-2 border-t flex">
            <input 
              value={input} onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-l p-2 outline-none text-black" 
              placeholder="Hỏi AI về blog..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-3 rounded-r">Gửi</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
        >
          💬 AI Chat
        </button>
      )}
    </div>
  );
}