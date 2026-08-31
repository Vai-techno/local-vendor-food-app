import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

export default function AIChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am LocalBite AI. I can help you discover nearby food, recommend dishes based on your budget, or answer questions about our vendors. What are you craving?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // In a real app, this should go through the backend to protect the API key and fetch DB context.
      // For this demo, we'll hit an imaginary backend endpoint that uses Gemini, 
      // or we can simulate a response if we don't have the API key in the client.
      // Wait, AI Studio injects GEMINI_API_KEY into process.env, which is only on the server.
      // I should create an endpoint in server.ts!
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 md:bottom-24 md:right-8 w-80 sm:w-96 bg-white rounded-2xl shadow-[0px_12px_32px_rgba(39,101,124,0.2)] border border-surface-variant z-50 overflow-hidden flex flex-col h-[500px]">
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-bold">LocalBite AI</span>
        </div>
        <button onClick={onClose} className="hover:bg-primary-container p-1 rounded-full"><span className="material-symbols-outlined text-sm">close</span></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface-container text-on-surface rounded-tl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-surface-container text-on-surface rounded-2xl rounded-tl-sm p-3 text-sm flex gap-1">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
             </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-surface-variant bg-white flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for food recommendations..."
          className="flex-1 border border-outline-variant rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>
    </div>
  );
}
