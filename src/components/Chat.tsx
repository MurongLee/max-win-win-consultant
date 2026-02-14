'use client';

import { useState, useRef } from 'react';
import { Send, Loader2, Bot, Sparkles, Copy, Check, Upload, X, Mic, MicOff } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UploadedFile {
  name: string;
  type: string;
  content?: string;
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const fileType = file.type;
      let content = '';

      if (fileType.startsWith('image/')) {
        content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else if (fileType === 'text/plain' || fileType === 'text/markdown') {
        content = await file.text();
      } else if (fileType === 'application/pdf') {
        content = `[PDF文件: ${file.name}]`;
      } else {
        content = `[文件: ${file.name}]`;
      }

      setUploadedFiles(prev => [...prev, {
        name: file.name,
        type: fileType,
        content
      }]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 语音识别功能
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('您的浏览器不支持语音识别功能');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        setInput(prev => prev + transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg || '[上传了文件]' }]);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMsg }],
          files: uploadedFiles
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
      
      setUploadedFiles([]);
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

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-500">思考中...</span>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {uploadedFiles.map((file, i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
              <Upload className="w-3 h-3" />
              <span>{file.name}</span>
              <button onClick={() => removeFile(i)} className="ml-1 hover:text-amber-900">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          {/* 文件上传 */}
          {/* 文件上传 - 暂不开放 */}
          <div 
            className="px-3 py-3 border border-gray-200 rounded-xl flex items-center cursor-not-allowed opacity-50"
            title="敬请期待"
          >
            <Upload className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* 语音输入 */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-3 py-3 border rounded-xl flex items-center ${
              isRecording 
                ? 'border-red-500 bg-red-50 text-red-500' 
                : 'border-gray-300 hover:bg-gray-50 text-gray-500'
            }`}
            title={isRecording ? '点击停止录音' : '点击开始语音输入'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          {/* 文本输入 */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? '正在录音...' : '输入你的销售难题...'}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          
          {/* 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
            className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
