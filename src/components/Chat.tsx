'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, Sparkles, Copy, Check } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setError('');
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }] })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '请求失败');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
      setStreamingContent('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold">Max-Win-Win 战略参谋</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">由 20 年实战经验驱动的 B2B 销售智囊</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Bot className="w-12 h-12 mb-3" />
            <p>描述你的销售困境，我为你诊断</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.content, i)}
                  className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {copiedIndex === i ? (
                    <>
                      <Check className="w-3 h-3" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      复制
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Streaming content */}
        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-2xl bg-gray-100 text-gray-800">
              <div className="whitespace-pre-wrap leading-relaxed">
                {streamingContent}
                <span className="inline-block w-2 h-4 bg-gray-500 animate-pulse ml-1"></span>
              </div>
            </div>
          </div>
        )}

        {isLoading && !streamingContent && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-500">思考中...</span>
            </div>
          </div>
        )}
        
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的销售难题..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
